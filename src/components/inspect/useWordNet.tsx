import deepmerge from "deepmerge"
import React, { FC, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { EntityType, Mapping, SynsetLemma } from "../../lib/types"
import { cacheFetcher, localResourceFetcher, remoteResourceFetcher } from "./wordnetCache"

export type Cache = any

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

export const validateKey = (key: string[]) => {
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
const useCachedFetcher = () => {
  const { cache, update } = useContext(WordNetContext)
  const fetcher = async (type: string, ...key: string[]) => {
    return cacheFetcher(
      cache,
      update,
      localResourceFetcher
    )(type, ...key)
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

// type TypeKey = { type: string, keys: string[] }
// export function useWordNetR() {
//   const { cache, update } = useContext(WordNetContext)
//   const fetcher = async (type: string, ...key: string[]) => {
//     return cacheFetcher(cache, update)(type, ...key)
//   }
//   // useSWR()

// }