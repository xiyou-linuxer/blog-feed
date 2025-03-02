import members from '~/data/members.json'
import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'
import { getPosts } from '~/utils/feed'

export async function fetchAndStoreFeeds() {
    await connectDB()
    console.info('⏳ 开始爬取 RSS 订阅源...')

    for (const member of members) {
        console.info(`📄 正在解析 ${member.name}`)
        const posts = await getPosts(member.feed)

        for (const post of posts) {
            const feed = {
                author: member.name,
                tag: member.tag,
                ...post,
            }

            await Article.updateOne(
                { link: feed.link },
                feed,
                { upsert: true },
            )
        }

        console.info(`✅ 已存储 ${member.name} 的文章`)
    }

    console.info('✅ 已完成 RSS 订阅源爬取')
}
