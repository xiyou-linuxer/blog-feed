import pLimit from 'p-limit'

export default defineTask({
    async run() {
        await connectDB()
        const { feedListUrl, concurrency = 5 } = useRuntimeConfig()

        if (!feedListUrl)
            throw new Error('❌ 未配置订阅源 URL，请检查 runtimeConfig 设置')

        console.info('🔍 正在获取订阅源列表...', feedListUrl)

        const feedList = await cachedFeedList()
        await useStorage().setItem('update:start', new Date().toISOString())

        console.info('🚀 开始爬取订阅源，请稍候...')

        const limit = pLimit(concurrency)
        const tasks = feedList.map(feedMeta => limit(() => updateFeed(feedMeta)))

        await Promise.allSettled(tasks)

        console.info('🎉 订阅源爬取完成！')
        await useStorage().setItem('update:finish', new Date().toISOString())

        return { result: 'success' }
    },
})
