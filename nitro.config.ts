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

    runtimeConfig: {
        feedSource: 'https://gh.llkk.cc/https://github.com/xiyou-linuxer/website-2024/blob/main/docs/.vitepress/data/members.json',
        nameKey: 'name',
        tagKey: 'grade',
        feedKey: 'feed',
    },

    scheduledTasks: {
        '58 3-23/8 * * *': ['update'],
    },
})
