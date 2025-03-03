import { Article } from '~/models/article'
import { feedSource } from '~/package.json'
import { connectDB } from '~/utils/db'
import { getPosts } from '~/utils/feed'

export async function fetchAndStoreFeeds() {
    await connectDB()
    console.info('⏳ 已连接数据库，正在获取订阅源信息')
    const members = await fetch(feedSource).then(res => res.json())
    console.info('⏳ 开始爬取 RSS 订阅源')

    for (const { feed, name, grade } of members) {
        if (!feed)
            continue

        console.info(`📄 解析 ${grade} 级 ${name}：${feed}`)
        const posts = await getPosts(feed)

        for (const post of posts) {
            await Article.updateOne(
                { link: post.link },
                { feed, grade, ...post },
                { upsert: true },
            )
        }

        console.info(`✅ 已存储 ${name} 的文章`)
    }

    console.info('✅ 已完成 RSS 订阅源爬取')
}
