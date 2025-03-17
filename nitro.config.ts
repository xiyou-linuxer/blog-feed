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
        '/opml': { headers: { 'Content-Type': 'application/xml' } },
        '/rss': { headers: { 'Content-Type': 'application/xml' } },
    },

    runtimeConfig: {
        /** 订阅源 JSON 的 URL */
        feedListUrl: 'https://raw.githubusercontent.com/xiyou-linuxer/website-2024/main/docs/.vitepress/data/members.json',

        /** 订阅源 JSON 的名称字段 */
        nameKey: 'name',
        /** 订阅源 JSON 的标签字段 */
        tagKey: 'grade',
        /** 订阅源 JSON 的订阅源字段 */
        feedKey: 'feed',

        /** 爬取并发限制 */
        concurrency: 5,

        /** 本网站的创建时间 */
        timeEstablished: '2025-03-01',
        /** 本 API 的构建时间 */
        buildTime: new Date().toISOString(),

        /** 订阅源列表的创建者 */
        author: {
            name: 'Xiyou Linux Group',
            email: 'root@xiyoulinux.org',
            homepage: 'https://www.xiyoulinux.com/',
        },
    },

    scheduledTasks: {
        '58 3-23/8 * * *': ['update'],
    },
})
