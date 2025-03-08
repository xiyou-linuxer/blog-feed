import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
    attributeNamePrefix: '$',
    cdataPropName: '$',
    ignoreAttributes: false,
    isArray: name => name === 'entry',
    textNodeName: '_',
})

const feedTypeMap = {
    atom1: {
        test: xml => xml?.feed,
        parse: xml => toArray(xml.feed.entry).map((entry) => {
            return {
                author: purifyNode(xml.feed.title),
                title: purifyNode(entry.title),
                description: purifyNode(entry.summary || entry.content),
                link: entry.link.$href,
                date: purifyDate(entry.published || entry.updated),
            }
        }),
    },
    rss2: {
        test: xml => xml?.rss,
        parse: xml => toArray(xml.rss.channel.item).map((item) => {
            return {
                author: purifyNode(xml.rss.channel.title),
                title: purifyNode(item.title),
                description: purifyNode(item.description),
                link: item.link,
                date: purifyDate(item.pubDate || item.pubdate),
            }
        }),
    },
}

function toArray<T>(obj: T | T[]): T[] {
    if (obj === undefined)
        return []
    return Array.isArray(obj) ? obj : [obj]
}

function purifyNode(node: any): string {
    const str = typeof node === 'string' ? node : node?._ || node?.$ || ''
    return str
        .replace(/[\x00-\x08]/g, '') // eslint-disable-line no-control-regex
        .replace(/<[^>]*>/g, '')
        .slice(0, 200)
}

export function purifyDate(date: string): string {
    return new Date(date).toISOString()
}

export async function getPosts(feedUrl: string) {
    const feed = await $fetch(feedUrl, {
        parseResponse: xml => parser.parse(xml),
    }).catch(err => console.warn(`❌ 获取 Feed 失败 ${feedUrl}`, err))

    const feedType = Object.values(feedTypeMap).find(type => type.test(feed))
    if (!feedType) {
        console.warn(`❌ 无法识别的 Feed 格式 ${feedUrl}`, feed)
        return []
    }

    return feedType.parse(feed)
}

export const cachedFeedList = defineCachedFunction(async (tag?: string) => {
    const { feedListUrl, feedKey, tagKey } = useRuntimeConfig()

    const rawFeedList = await $fetch<{ [key: string]: string }[]>(
        feedListUrl,
        { parseResponse: JSON.parse },
    )
    const feedList = rawFeedList
        .filter(meta => meta[feedKey] && (meta[tagKey] === tag || !tag))

    return feedList
}, {
    maxAge: 60 * 60 * 3,
    getKey: tag => tag ?? 'feedList',
})
