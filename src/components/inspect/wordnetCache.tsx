import { resourceHandler } from "../../lib/resources/resources"
import { Cache, GetCacheValues, validateKey } from "./useWordNet"

// const getFromCache = (cache: Cache, type: string, keys: string[]) => {
//   return Object.fromEntries(keys
//     .map(k => [k, cache?.[type]?.[k]])
//   )
// }

type ResourceFetcer = (type: string, keys: string[]) => Promise<object>
export const remoteResourceFetcher: ResourceFetcer = async (type: string, keys: string[]) => {
  const urlkeys = keys.join(",")
  const url = `/api/dics2/${type}/${urlkeys}`
  const r = await fetch(url).then(f => f.json())
  return r
}

// export const localResourceFetcher: ResourceFetcer = async (type: string,
//   keys: string[]) => {
//   const { resourceHandler } = await import("../../lib/resources")
//   return resourceHandler(type, keys)
// }

export const cacheFetcher = (
  getCacheValues: GetCacheValues,
  update: (item: Cache) => GetCacheValues,
  resourceFetcher: ResourceFetcer
) => {
  return async (type: string, ...keys: string[]) => {
    try {
      validateKey(keys)
      const cached = getCacheValues(type, keys)
      const uncachedKey = keys.filter(k => !cached[k])
      if (uncachedKey.length === 0) {
        return cached
      }
      const r = await resourceFetcher(type, keys)
      const newCacheGetValue = update(r)
      return newCacheGetValue(type, keys)
    } catch (e) {
      console.error(type, keys, e)
    }
  }

}
