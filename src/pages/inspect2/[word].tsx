import { AddIcon } from "@chakra-ui/icons"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Container, Heading, HStack, Link, List, ListItem, Spinner, Stack, UnorderedList } from "@chakra-ui/react"
import deepmerge from "deepmerge"
import { GetServerSideProps } from "next"
import NextLink from "next/link"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
// import { searchLemma } from "../../lib/dics"



const useWordNetInternal = () => {
  const [cache, setCache] = useState<{ [key in string]: { [key in string]: any } }>({})
  const update = (entries) => {
    const newCache = deepmerge(cache, entries)
    setCache(newCache)
    return newCache
  }
  return {
    cache, update
  }
}
type WordNetContextItem = ReturnType<typeof useWordNetInternal>
const WordNetContext = React.createContext<WordNetContextItem>(null)

const WordNetProvider = ({ children }) => {
  const value = useWordNetInternal()
  return <WordNetContext.Provider value={value}>
    {children}
  </WordNetContext.Provider>
}

type EntityType = "sense" | "senseRelated" | "synset" | "lemma" | "lexicalEntry"

const useCachedEntity = (type: EntityType, key: string | string[]) => {
  const { cache } = useContext(WordNetContext)

}
const useEntity = (type: EntityType, key:  string[]) => {
  const { cache, update } = useContext(WordNetContext)
  const fetcher = async (type, key) => {

    try {
      const caches = Object.fromEntries([key].flat()
        .map(k => [k, cache?.[type]?.[key]])
      )
      const lack = Object.entries(caches).filter(([k, v]) => !v).map(([k]) => k)
      if (lack.length === 0) {
        return caches
      }
    
      const url = `/api/search/${type}/${lack.join("/")}`
      const r = await fetch(url).then(f => f.json())
      const newCache = update(r)

      return Object.fromEntries(key.map(k => [k, newCache[type][k]]))
    } catch (e) {
      console.error(e)
    }
  }
  return useSWR([type, key], fetcher)
}

export const PageInner = ({ word }) => {
  const { data } = useEntity("lemma", word)
  if (!data) {
    return null
  }
  return null //<Entry word={word} lexIds={data.lexicalEntry} />
}

export const Page = ({ word }) => {
  return <WordNetProvider>
    <PageInner word={word} />
  </WordNetProvider>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  // const entry = searchWord(word.toString())
  // console.log(entry)
  return {
    props: {
      word
      // , entry
    }
  }
}

export default Page

function searchWord(arg0: string) {
  throw new Error("Function not implemented.")
}
