export const feedTypeMap = {
    atom1: {
        test: xml => xml?.feed,
        parse: xml => toArray(xml.feed.entry).map(entry => ({
            author: purifyNode(xml.feed.title),
            title: purifyNode(entry.title),
            description: purifyDescription(entry.summary, entry.content),
            link: fixUrl(entry.link.$href, xml.__url__),
            date: purifyDate(entry.published || entry.updated),
        })),
    },
    rss2: {
        test: xml => xml?.rss,
        parse: xml => toArray(xml.rss.channel.item).map(item => ({
            author: purifyNode(xml.rss.channel.title),
            title: purifyNode(item.title),
            description: purifyDescription(item.description, item.encoded),
            link: fixUrl(item.link, xml.__url__),
            date: purifyDate(item.pubDate || item.pubdate),
        })),
    },
}

function toArray<T>(obj: T | T[]): T[] {
    if (obj === undefined)
        return []
    return Array.isArray(obj) ? obj : [obj]
}

type Node = string | {
    $?: string
    _?: string
    $type?: string
    $href?: string
}

function purifyNode(node: Node, limit = 200): string {
    const str = typeof node === 'string' ? node : node?._ || node?.$ || ''
    return str
        .replace(/[\x00-\x08]/g, '') // eslint-disable-line no-control-regex
        .replace(/<[^>]*>/g, '')
        .slice(0, limit)
}

function purifyDescription(description: Node, content: Node): string {
    const needContent = (description as any).$type

    return needContent
        ? purifyNode(content) || purifyNode(description)
        : purifyNode(description) || purifyNode(content)
}

function purifyDate(date: string): string {
    return new Date(date).toISOString()
}

function fixUrl(url: string, baseUrl?: string) {
    if (!baseUrl)
        return url

    const link = new URL(url, baseUrl)
    const feed = new URL(baseUrl)

    if (link.protocol !== feed.protocol)
        link.protocol = feed.protocol = 'https:'

    if (link.hostname === 'example.com')
        link.hostname = feed.hostname

    return link.href
}
