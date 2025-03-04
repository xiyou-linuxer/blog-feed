import packageJson from '~/package.json'

export default defineEventHandler(() => {
    return ({
        result: 'success',
        packageJson,
    })
})
