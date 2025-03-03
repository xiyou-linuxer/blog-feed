import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String, unique: true, required: true },
    date: { type: Date, required: true },
    author: { type: String, required: true },
    feed: { type: String, required: true },
    grade: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

ArticleSchema.index({ date: -1 })
ArticleSchema.index({ grade: 1 })

export const Article = mongoose.model('Article', ArticleSchema)
