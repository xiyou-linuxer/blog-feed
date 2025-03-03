import process from 'node:process'
import mongoose from 'mongoose'

export async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'

    if (mongoose.connection.readyState >= 1)
        return
    await mongoose.connect(MONGO_URI, { dbName: 'blog-feed', authSource: 'admin' })
    console.info('✅ MongoDB 连接成功')
}
