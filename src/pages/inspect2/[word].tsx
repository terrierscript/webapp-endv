import { AddIcon } from "@chakra-ui/icons"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, BoxProps, Button, Container, Heading, HStack, Link, List, ListItem, Spinner, Stack, UnorderedList } from "@chakra-ui/react"
import deepmerge from "deepmerge"
import { GetServerSideProps } from "next"
import NextLink from "next/link"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { Glossaries } from "../../components/Glossaries"
import { EntityType } from "../../lib/types"

const Block = (props: BoxProps) => <Box
  boxShadow="md"
  p={4}
  {...props}
/>

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


const getFromCache = (cache, type, key) => {
  return Object.fromEntries(key
    .map(k => [k, cache?.[type]?.[k]])
  )
}
// const useCachedEntity = (type: EntityType, key: string | string[]) => {
//   const { cache } = useContext(WordNetContext)
//   return { data: getFromCache(cache, type, key) }
// }
const useEntity = (type: EntityType, key: string ) => {
  const { cache, update } = useContext(WordNetContext)
  const [data, setData] = useState(null)
  const fetcher = async (type, key) => {
    try {
      if (cache?.[type]?.[key]) {
        return cache?.[type]?.[key]
      }
    
      const url = `/api/dics2/${type}/${key}`
      const r = await fetch(url).then(f => f.json())
      const newCache = update(r)
      return newCache[type][key]
    } catch (e) {
      console.error(type, key,e)
    }
  }
  useEffect(() => {
    fetcher(type,key).then(item => setData(item))
  }, [type, key])
  return { data }
}

const SynsetLemma = ({ synsetId }) => {
  const { data } = useEntity("synsetLemma", synsetId)
  if (!data) {
    return null
  }
  console.log(data)
  return <HStack>{data?.map(l => {
    return <Box>{l}</Box>
  })}</HStack>
}
const Synset = ({ synsetId }) => {
  const { data } = useEntity("synset", synsetId)
  const { definition, example} = data ?? {}
  if (!data) {
    return null
  }
  // console.log(data)
  return <Box>
    <Glossaries definition={definition} example={example}/>
  </Box>
}
const Sense = ({ senseId }) => {
  const { data } = useEntity("sense", senseId)
  if (!data) {
    return null
  }
  return <Block >
    {senseId}
    <Box>
      <SynsetLemma synsetId={data.synset} />
      <Synset synsetId={data.synset} />
    </Box>
  </Block >
  
}
const LexicalEntries = ({lexicalEntryId}) => {
  const { data } = useEntity("lexicalEntry", lexicalEntryId)
  console.log(data)
  if (!data) {
    return null
  }
  return <Block >
    {data.lemma.writtenForm}
    {data.sense.map(s => {
      return <Sense senseId={s} />
    })}
  </Block >
}
export const PageInner = ({ word }) => {
  const { data } = useEntity("lemma", word)
  console.log(data)
  if (!data) {
    return null
  }
  const ls = data.lexicalEntry
  // console.log(data, ls)
  return <Block>{
    ls?.map(l => {
      return <LexicalEntries key={l} lexicalEntryId={l} />
    })
  }</Block>
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
