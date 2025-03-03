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
        '30 1-23/4 * * *': ['db:update'],
    },
})
