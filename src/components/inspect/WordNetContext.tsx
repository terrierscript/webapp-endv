import deepmerge from "deepmerge"
import React, { FC, useState } from "react"


export type Cache = any
const useWordNetInternal = (preload = {}) => {
  const [cache, setCache] = useState<{
    [key in string]: {
      [key in string]: any
    }
  }>(preload)
  const update = (entries: Cache) => {
    const newCache = deepmerge(cache, entries, {
      arrayMerge: (_, sourceArray) => sourceArray
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
export const WordNetContext = React.createContext<WordNetContextItem>(null)

export const WordNetProvider: FC<{ preload: Cache }> = ({ children, preload }) => {
  const value = useWordNetInternal(preload)
  return <WordNetContext.Provider value={value}>
    {children}
  </WordNetContext.Provider>
}
