export default defineEventHandler((event) => {
    // https://github.com/nitrojs/nitro/issues/2340
    if (event.method === 'OPTIONS') {
        // https://developer.chrome.google.cn/blog/private-network-access-preflight?hl=zh-cn
        setHeader(event, 'Access-Control-Allow-Private-Network', true)
        return ''
    }
})
