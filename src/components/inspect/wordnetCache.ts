import { resourceHandler } from "../../lib/___resources/resources"
import { Cache, validateKey } from "./WordNetContext"

const getFromCache = (cache: Cache, type: string, keys: string[]) => {
  return Object.fromEntries(keys
    .map(k => [k, cache?.[type]?.[k]])
  )
}
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
  cache: Cache,
  update: (item: Cache) => Cache,
  resourceFetcher: ResourceFetcer
) => {
  return async (type: string, ...keys: string[]) => {
    try {
      validateKey(keys)
      const cached = getFromCache(cache, type, keys)
      const uncachedKey = keys.filter(k => !cached[k])
      if (uncachedKey.length === 0) {
        return cached
      }

      const r = await resourceFetcher(type, keys)
      const newCache = update(r)
      return getFromCache(newCache, type, keys)
    } catch (e) {
      console.error(type, keys, e)
    }
  }

}
