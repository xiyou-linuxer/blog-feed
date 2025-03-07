import { XMLBuilder } from 'fast-xml-parser'
import { Article } from '~/models/article'
import packageJson from '~/package.json'

const builder = new XMLBuilder({
    attributeNamePrefix: '$',
    format: true,
    ignoreAttributes: false,
})

const runtimeConfig = useRuntimeConfig()

export default defineCachedEventHandler(async () => {
    await connectDB()

    const articles = await Article
        .find({})
        .sort({ date: -1 })
        .limit(60)
        .lean()

    const items = articles.map(article => ({
        title: article.title,
        link: article.link,
        description: article.description,
        author: article.author,
        guid: article.link,
        pubDate: article.date.toISOString(),
    }))

    const channel = {
        title: `${runtimeConfig.author?.name}的订阅`,
        link: runtimeConfig.author?.homepage,
        description: runtimeConfig.description,
        webMaster: `${packageJson.author?.email} (${packageJson.author?.name})`,
        item: items,
    }

    return builder.build({
        '?xml': { $version: '1.0', $encoding: 'UTF-8' },
        'rss': { $version: '2.0', channel },
    })
}, { maxAge: 60 * 60 * 2 })
