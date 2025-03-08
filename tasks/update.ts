import pLimit from 'p-limit'
import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'
import { getPosts } from '~/utils/feed'

export default defineTask({
    async run() {
        await connectDB()
        const { feedListUrl, concurrency = 5 } = useRuntimeConfig()

        if (!feedListUrl)
            throw new Error('未配置订阅源')

        console.info(`⏳ 获取 ${feedListUrl}`)

        const feedList = await cachedFeedList()
        await useStorage().setItem('update:start', new Date().toISOString())

        console.info('⏳ 开始爬取订阅源')

        const limit = pLimit(concurrency)
        const tasks = feedList.map(feedMeta => limit(() => processFeed(feedMeta)))

        await Promise.allSettled(tasks)

        console.info('✅ 已完成订阅源爬取')
        await useStorage().setItem('update:finish', new Date().toISOString())

        return { result: 'success' }
    },
})

async function processFeed(feedMeta: any) {
    const { feedKey, tagKey, nameKey } = useRuntimeConfig()
    const { [feedKey]: feed, [tagKey]: tag, [nameKey]: name } = feedMeta

    console.info(`📄 解析 [${tag}] ${name} ${feed}`)

    const posts = await getPosts(feed)
    await Promise.allSettled(posts.map(post => Article.updateOne(
        { link: post.link },
        { ...post, feed, tag },
        { upsert: true },
    )))

    console.info(`✅ 已存储 [${tag}] ${name}`)
}
