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
        test: xml => xml.feed,
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
        test: xml => xml.rss,
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
    return str.replace(/<[^>]*>/g, '').slice(0, 200)
}

function purifyDate(date: string): string {
    return new Date(date).toISOString()
}

export async function getPosts(feed: string) {
    const response = await fetch(feed)
    if (!response.ok) {
        console.warn(`❌ Feed 请求失败 ${feed} ${response.status} ${response.statusText}`)
        return []
    }

    const data = await response.text()
    const parsed = parser.parse(data)

    for (const feedType of Object.values(feedTypeMap)) {
        if (feedType.test(parsed))
            return feedType.parse(parsed)
    }

    console.warn(`❓ 未知的 Feed 类型 ${feed}`, parsed)
    return []
}
