import deepmerge from "deepmerge"
import React, { FC, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { EntityType, Mapping, SynsetLemma } from "../../lib/types"

type Cache = any

const useWordNetInternal = (preload = {}) => {
  const [cache, setCache] = useState<{
    [key in string]: {
      [key in string]: any
    }
  }>(preload)
  const update = (entries: Cache) => {
    const newCache = deepmerge(cache, entries, {
      arrayMerge: (_, sourceArray,) => sourceArray
    })
    setCache(newCache)
    return newCache
  }
  return {
    cache, update
  }
}

const validateKey = (key: string[]) => {
  if (!Array.isArray(key)) {
    return true
  }
  key.every(k => {
    if (typeof k !== "string") {
      console.error("invalid key", key)
    }
  })
}

type WordNetContextItem = ReturnType<typeof useWordNetInternal>
// @ts-ignore
const WordNetContext = React.createContext<WordNetContextItem>(null)

export const WordNetProvider: FC<{ preload: Cache }> = ({ children, preload }) => {
  const value = useWordNetInternal(preload)
  return <WordNetContext.Provider value={value}>
    {children}
  </WordNetContext.Provider>
}
const getFromCache = (cache: Cache, type: string, keys: string[]) => {
  return Object.fromEntries(keys
    .map(k => [k, cache?.[type]?.[k]])
  )
}
type ResourceFetcer = (type: string, keys: string[]) => Promise<object>
const remoteResourceFetcher: ResourceFetcer = async (type: string, keys: string[]) => {
  const urlkeys = keys.join(",")
  const url = `/api/dics2/${type}/${urlkeys}`
  const r = await fetch(url).then(f => f.json())
  return r
}
const cacheFetcher = (
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

      const r = resourceFetcher(type, keys)
      const newCache = update(r)
      return getFromCache(newCache, type, keys)
    } catch (e) {
      console.error(type, keys, e)
    }
  }

}


const useCachedFetcher = () => {
  const { cache, update } = useContext(WordNetContext)
  const fetcher = async (type: string, ...key: string[]) => {
    return cacheFetcher(cache, update, remoteResourceFetcher)(type, ...key)
  }
  return fetcher
}

export function useWordNet<T>(type: EntityType, key: string[] | string): Mapping<T> | undefined {
  const { cache, update } = useContext(WordNetContext)
  const [data, setData] = useState<Mapping<T>>()
  const fetcher = useCachedFetcher()
  const keys = [key].flat()
  useEffect(() => {
    if (keys.length === 0) {
      return
    }
    fetcher(type, ...keys).then(item => {
      if (typeof key === "string") {
        setData(item?.[key])
      } else {
        setData(item)
      }
    })
  }, [type, keys.join("/")])
  return data
}

type TypeKey = { type: string, keys: string[] }
export function useWordNetR() {
  const { cache, update } = useContext(WordNetContext)
  const fetcher = async (type: string, ...key: string[]) => {
    return cacheFetcher(cache, update)(type, ...key)
  }
  // useSWR()

}