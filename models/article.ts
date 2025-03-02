import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String, unique: true, required: true },
    date: { type: Date, required: true },
    author: { type: String, required: true },
    tag: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

ArticleSchema.index({ date: -1 })
ArticleSchema.index({ tag: 1 })
ArticleSchema.index({ author: 1 })

export const Article = mongoose.model('Article', ArticleSchema)
