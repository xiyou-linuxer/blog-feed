import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'
import { getPosts } from '~/utils/feed'

export default defineTask({
    async run() {
        await connectDB()
        const {
            feedListUrl,
            nameKey,
            tagKey,
            feedKey,
        } = useRuntimeConfig()

        if (!feedListUrl)
            throw new Error('未配置订阅源')

        console.info(`⏳ 获取 ${feedListUrl}`)

        const feedList = await cachedFeedList()
        await useStorage().setItem('update:start', new Date().toISOString())

        console.info('⏳ 开始爬取订阅源')

        for (const feedMeta of feedList) {
            const { [feedKey]: feed, [tagKey]: tag, [nameKey]: name } = feedMeta

            console.info(`📄 解析 [${tag}] ${name} 的 ${feed}`)
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
        await useStorage().setItem('update:finish', new Date().toISOString())
        return { result: 'success' }
    },
})
