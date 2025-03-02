import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'

export default defineEventHandler(async (event) => {
    await connectDB()
    const query = getQuery(event)

    const filter: any = {}
    if (query.tag)
        filter.tag = query.tag
    if (query.author)
        filter.author = query.author

    // 解析分页参数
    const page = Number.parseInt(query.page as string) || 1
    const limit = Number.parseInt(query.limit as string) || 24
    const skip = (page - 1) * limit

    const [articles, total] = await Promise.all([
        Article
            .find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        Article.countDocuments(filter),
    ])

    return {
        success: true,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        articles,
    }
})
