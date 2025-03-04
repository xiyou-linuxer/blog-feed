import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'

export default defineEventHandler(async (event) => {
    await connectDB()
    const {
        page: pageQuery,
        limit: limitQurery,
        ...filter
    } = getQuery(event)

    const page = Number.parseInt(pageQuery as string) || 1
    const limit = Number.parseInt(limitQurery as string) || 24
    const skip = (page - 1) * limit

    const [articles, total] = await Promise.all([
        Article
            .find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Article.countDocuments(filter),
    ])

    return {
        result: 'success',
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        articles,
    }
})
