import { fetchAndStoreFeeds } from '~/tasks/db/update'

export default defineEventHandler(async (_event) => {
    console.info('⏳ 正在手动触发数据库更新...')
    await fetchAndStoreFeeds()
    return { success: true, message: '数据库更新已触发并成功执行' }
})
