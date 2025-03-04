import { XMLBuilder } from 'fast-xml-parser'
import { getFeedSource } from '~/utils/feed'

const builder = new XMLBuilder({
    attributeNamePrefix: '$',
    format: true,
    ignoreAttributes: false,
})

const runtimeConfig = useRuntimeConfig()

function mapEntry(item: Record<string, any>) {
    return {
        $text: item[runtimeConfig.nameKey] || item.name || item.title,
        $category: item[runtimeConfig.tagKey],
        $type: 'rss',
        $xmlUrl: item[runtimeConfig.feedKey] || item.feed,
        $htmlUrl: item.link || item[runtimeConfig.feedKey] || item.feed,
    }
}

export default defineEventHandler(async () => {
    const members = await getFeedSource()
    const outlines = members.filter(item => item[runtimeConfig.feedKey]).map(mapEntry)

    const opml = {
        $version: '2.0',
        head: {
            title: `${runtimeConfig.author?.name}的订阅`,
            dateCreated: new Date(runtimeConfig.timeEstablished).toISOString(),
            dateModified: runtimeConfig.public?.buildTime,
            ownerName: runtimeConfig.author?.name,
            ownerEmail: runtimeConfig.author?.email,
            ownerId: runtimeConfig.author?.homepage,
            docs: 'https://opml.org/spec2.opml',
        },
        body: { outline: outlines },
    }

    return builder.build({
        '?xml': { $version: '1.0', $encoding: 'UTF-8' },
        opml,
    })
})
