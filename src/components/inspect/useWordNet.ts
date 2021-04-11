import { useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { EntityType, Mapping, SynsetLemma } from "../../lib/dictionary/types"
import { WordNetContext } from "./WordNetContext"
import { cacheFetcher, remoteResourceFetcher } from "./wordnetCache"

const useCachedFetcher = () => {
  const { cache, update } = useContext(WordNetContext)
  const fetcher = async (type: string, ...key: string[]) => {
    return cacheFetcher(
      cache,
      update,
      remoteResourceFetcher
    )(type, ...key)
  }
  return fetcher
}


type KeyFn = () => string[] | null | undefined
type Key = string[] | null | KeyFn

export function useWordNetQuery<T>(type: EntityType | null, key: Key): Mapping<T> | undefined {
  const [data, setData] = useState<Mapping<T>>()
  const fetcher = useCachedFetcher()

  const _keys = useMemo(() => {
    if (typeof key === "function") { return key() ?? null }
    if (key === null) { return null }
    if (key.length === 0) { return null }
    return key
  }, [key])
  const keys = useMemo(() => {
    return _keys?.filter(k => typeof k === "string")
  }, [_keys])

  useEffect(() => {
    if (!type || !keys) {
      return
    }
    if (keys.length === 0) {
      return
    }
    const lb = `${new Date().getTime()}-${type}-${keys.join(":")}`
    console.time(lb)
    fetcher(type, ...keys).then(item => {
      console.timeLog(lb)
      if (typeof key === "string") {
        setData(item?.[key])
      } else {
        setData(item)
      }
    })
  }, [type, keys ? keys.join("/") : null])
  return data
}

export function useWordNet<T>(type: EntityType, key: string[] | string): Mapping<T> | undefined {
  return useWordNetQuery(type, [key].flat())
}

// type TypeKey = { type: string, keys: string[] }
// export function useWordNetR() {
//   const { cache, update } = useContext(WordNetContext)
//   const fetcher = async (type: string, ...key: string[]) => {
//     return cacheFetcher(cache, update)(type, ...key)
//   }
//   // useSWR()

// }