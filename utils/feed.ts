export const feedTypeMap = {
    atom1: {
        test: xml => xml?.feed,
        parse: xml => toArray(xml.feed.entry).map((entry) => {
            return {
                author: purifyNode(xml.feed.title),
                title: purifyNode(entry.title),
                description: purifyNode(entry.summary || entry.content),
                link: fixUrl(entry.link.$href),
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
                link: fixUrl(item.link),
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

function purifyDate(date: string): string {
    return new Date(date).toISOString()
}

function fixUrl(url: string) {
    // Not implemented
    return url
}
