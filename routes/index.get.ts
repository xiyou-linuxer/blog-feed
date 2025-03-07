export default defineEventHandler(async (event) => {
    const { tag: tagQuery } = getQuery(event)
    const tag = tagQuery ? String(tagQuery) : undefined

    const update = {
        init: await useStorage().getItem('update:init'),
        start: await useStorage().getItem('update:start'),
        finish: await useStorage().getItem('update:finish'),
    }
    const feedList = await cachedFeedList(tag)

    return {
        result: 'success',
        update,
        length: feedList.length,
    }
})
