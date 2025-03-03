import { Article } from '~/models/article'
import { connectDB } from '~/utils/db'

export default defineEventHandler(async (event) => {
    await connectDB()
    const query = getQuery(event)

    const filter: any = {}
    if (query.grade)
        filter.grade = query.grade
    if (query.author)
        filter.author = query.author

    const page = Number.parseInt(query.page as string) || 1
    const size = Number.parseInt(query.size as string) || 24
    const skip = (page - 1) * size

    const [articles, total] = await Promise.all([
        Article
            .find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(size),
        Article.countDocuments(filter),
    ])

    return {
        success: true,
        pagination: {
            page,
            size,
            total,
            totalPages: Math.ceil(total / size),
        },
        articles,
    }
})
