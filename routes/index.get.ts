export default defineEventHandler(async (event) => {
    const { tag: tagQuery } = getQuery(event)
    const tag = tagQuery ? String(tagQuery) : undefined

    const memStore = useStorage()

    const update = {
        init: await memStore.getItem('update:init'),
        start: await memStore.getItem('update:start'),
        finish: await memStore.getItem('update:finish'),
    }
    const rawFeedList = await cachedFeedList()
    const { tagKey } = useRuntimeConfig()
    const feedList = rawFeedList.filter(meta => meta[tagKey] === tag || !tag)

    return {
        result: 'success',
        update,
        length: feedList.length,
    }
})
