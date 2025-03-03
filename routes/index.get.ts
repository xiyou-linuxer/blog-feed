import packageJson from '~/package.json'

export default defineEventHandler(() => {
    return {
        success: true,
        packageJson,
    }
})
