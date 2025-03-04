import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'
import { getPosts } from '~/utils/feed'

export default defineTask({
    async run() {
        await connectDB()
        const {
            feedSource,
            nameKey,
            tagKey,
            feedKey,
        } = useRuntimeConfig()

        if (!feedSource)
            throw new Error('未配置订阅源')

        console.info(`⏳ 获取 ${feedSource}`)

        const members = feedSource.startsWith?.('http')
            ? await fetch(feedSource).then(res => res.json())
            : feedSource

        console.info('⏳ 开始爬取订阅源')

        for (const member of members) {
            const feed = member[feedKey]
            if (!feed)
                continue

            const tag = member[tagKey]
            const name = member[nameKey]

            console.info(`📄 解析 ${tag} 级 ${name}：${feed}`)
            const posts = await getPosts(feed)

            for (const post of posts) {
                await Article.updateOne(
                    { link: post.link },
                    { feed, tag, ...post },
                    { upsert: true },
                )
            }

            console.info(`✅ 已存储 ${name}`)
        }

        console.info('✅ 已完成订阅源爬取')
        return { result: 'success' }
    },
})
