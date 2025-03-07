import process from 'node:process'

export default defineNitroPlugin(async () => {
    await useStorage().setItem('update:init', new Date().toISOString())

    if (process.env.DISABLE_STARTUP_UPDATE !== 'true')
        await runTask('update')
})
