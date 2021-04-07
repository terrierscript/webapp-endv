import deepmerge from "deepmerge"
import React, { FC, useContext, useEffect, useState } from "react"
import { EntityType } from "../../lib/types"

type Cache = any

const useWordNetInternal = (preload = {}) => {
  const [cache, setCache] = useState<{
    [key in string]: {
      [key in string]: any
    }
  }>(preload)
  const update = (entries: Cache) => {
    const newCache = deepmerge(cache, entries, {
      arrayMerge: (_, sourceArray, ) => sourceArray
    })
    setCache(newCache)
    return newCache
  }
  return {
    cache, update
  }
}

const validateKey = (key:string[]) => {
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

export const WordNetProvider: FC<{ preload: Cache}> = ({ children, preload }) => {
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
const cacheFetcher = (cache: Cache, update: (item: Cache) => Cache) => {
  return async (type: string, ...keys: string[]) => {
    try {
      validateKey(keys)
      const cached = getFromCache(cache, type, keys)
      const uncachedKey = keys.filter(k => !cached[k])
      if (uncachedKey.length === 0) {
        return cached
      }

      const urlkeys = uncachedKey.join("/")
      const url = `/api/dics2/${type}/${urlkeys}`
      const r = await fetch(url).then(f => f.json())
      const newCache = update(r)
      return getFromCache(newCache, type, keys)
    } catch (e) {
      console.error(type, keys, e)
    }
  }

}

type Map<T> = {
  [key in string]: T
}
export function useWordNet<T>(type: EntityType, key:  string[]): Map<T> | undefined {
  const { cache, update } = useContext(WordNetContext)
  const [data, setData] = useState<Map<T>>()
  const fetcher = async (type:string, ...key:string[]) => {
    return cacheFetcher(cache, update)(type, ...key)
  }
  const keys = [key].flat()
  useEffect(() => {
    // console.log("effe", type, key)
    fetcher(type, ...keys).then(item => {
      // validateKey(key)
      // if (typeof key === "string") {
      //   setData(item?.[key])
      // } else {
        setData(item)
      // }
    })
  }, [type, ...keys])
  return data
}
