import process from 'node:process'

// https://nitro.unjs.io/config
export default defineNitroConfig({
    alias: {
        '~/': './',
    },
    compatibilityDate: '2025-03-01',
    experimental: {
        tasks: true,
    },
    runtimeConfig: {
        MONGO_URI: process.env.MONGO_URI,
    },
    scheduledTasks: {
        '30 1-23/4 * * *': ['db:update'],
    },
})
