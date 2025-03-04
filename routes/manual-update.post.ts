export default defineEventHandler(async (event) => {
    console.info('⏳ 正在手动触发数据库更新...')
    const payload = { ...getQuery(event) }
    const { result } = await runTask('update', { payload })
    return { result }
})
