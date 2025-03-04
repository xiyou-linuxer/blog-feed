// https://nitro.unjs.io/config
export default defineNitroConfig({
    alias: {
        '~/': './',
    },

    compatibilityDate: '2025-03-01',

    experimental: {
        tasks: true,
    },

    routeRules: {
        '/articles': { headers: { 'Access-Control-Allow-Origin': '*' } },
    },

    scheduledTasks: {
        '40 0-23/8 * * *': ['update'],
    },
})
