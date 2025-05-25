import { XMLParser } from 'fast-xml-parser'
import ghproxy from '~/data/ghproxy.json'
import { Article } from '~/models/article'

const parser = new XMLParser({
    attributeNamePrefix: '$',
    cdataPropName: '$',
    ignoreAttributes: false,
    isArray: name => name === 'entry',
    textNodeName: '_',
})

export async function parseFeed(feedUrl: string) {
    const feed = await $fetch(feedUrl, {
        parseResponse: xml => parser.parse(xml),
    }).catch(err => console.warn(`🚨 获取 Feed 失败 [${feedUrl}]`, err))

    feed.__url__ = feedUrl

    const feedType = Object.values(feedTypeMap).find(type => type.test(feed))
    if (!feedType) {
        console.warn(`⚠️ 无法识别的 Feed 格式 [${feedUrl}]`)
        return []
    }

    return feedType.parse(feed)
}

export async function updateFeed(feedMeta: any) {
    const { feedKey, tagKey, nameKey } = useRuntimeConfig()
    const { [feedKey]: feed, [tagKey]: tag, [nameKey]: name } = feedMeta

    console.info(`📰 正在处理 [${tag}] ${name} - ${feed}`)

    const posts = await parseFeed(feed)
    await Promise.allSettled(posts.map(post => Article.updateOne(
        { link: post.link },
        { ...post, feed, tag },
        { upsert: true },
    )))

    console.info(`✅ 完成 [${tag}] ${name}`)
}

export const cachedFeedList = defineCachedFunction(async () => {
    const { feedListUrl, feedKey } = useRuntimeConfig()

    const batchFetch = async (urls) => {
        const promises = urls.map(url => $fetch(url, { parseResponse: JSON.parse })
            .then(data => ({ url, data }))
            .catch(() => console.warn(`↩️ 获取 Feed 列表失败 [${url}]`)))

        for await (const result of promises) {
            if (result && result.data) {
                console.info(`✅ 成功获取 Feed 列表 [${result.url}]`)
                return result.data
            }
        }
        throw new Error('❌ 所有 Feed 列表源获取失败')
    }

    const feedList = await batchFetch([
        feedListUrl,
        ...ghproxy.map(proxyUrl => proxyUrl + feedListUrl),
    ])

    return feedList.filter(meta => meta[feedKey])
}, {
    maxAge: 60 * 60 * 3,
    getKey: () => 'feedList',
})
