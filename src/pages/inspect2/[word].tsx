import { AddIcon } from "@chakra-ui/icons"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, BoxProps, Button, Container, Heading, HStack, Link, List, ListItem, Spinner, Stack, UnorderedList } from "@chakra-ui/react"
import deepmerge from "deepmerge"
import { GetServerSideProps } from "next"
import NextLink from "next/link"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { ItemAccordion } from "../../components/Acordion"
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


const getFromCache = (cache, type:string, keys:string[]) => {
  return Object.fromEntries(keys
    .map(k => [k, cache?.[type]?.[k]])
  )
}

const cacheFetcher = (cache, update) => {
  return async (type, ...keys) => {
    try {
      const cached = getFromCache(cache, type, keys)
      const uncached = keys.filter(k => !cached[k])
      if (uncached.length === 0) {
        return cached
      }

      const url = `/api/dics2/${type}/${uncached.join("/")}`
      const r = await fetch(url).then(f => f.json())
      const newCache = update(r)
      return getFromCache(newCache,type, keys)
    } catch (e) {
      console.error(type, keys, e)
    }
  }

}
const useWordNet = (type: EntityType, key: string | string[] ) => {
  const { cache, update } = useContext(WordNetContext)
  const [data, setData] = useState(null)
  const fetcher = async (type, key) => {
    return cacheFetcher(cache, update)(type, key)
  }
  useEffect(() => {
    fetcher(type, key).then(item => {
      if (typeof key === "string") {
        setData(item[key])
      }else{
        setData(item)
      }
    })
  }, [type, ...[key].flat()])
  return { data }
}

const SynsetLemma = ({ synsetId }) => {
  const { data } = useWordNet("synsetLemma", synsetId)
  if (!data) {
    return null
  }
  // console.log(data)
  return <HStack>{data?.map(l => {
    return <Box>{l}</Box>
  })}</HStack>
}

const SynsetRelations = ({ data, relations }) => {
  if (!relations){
    return null
  }
    
  return <ItemAccordion title="relation">
    {relations.map(({ target, relType }) => {
      return <Box key={target}>
        <Box>
          {target}: {relType}
        </Box>
        <Synset synsetId={target} />
      </Box>
    })}
  </ItemAccordion>
}

const Synset = ({ synsetId }) => {
  const { data } = useWordNet("synset", synsetId)
  const { definition, example } = data ?? {}
  if (!data) {  
    return null
  }
  console.log("sss", synsetId, data?.synsetRelation)
  return <Block bg="rgba(10,0,0,0.1)">
    <Glossaries definition={definition} example={example} />
    <SynsetRelations data={data} relations={data.synsetRelation} />
  </Block>
}
const Sense = ({ senseId }) => {
  const { data } = useWordNet("sense", senseId)
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
  const { data } = useWordNet("lexicalEntry", lexicalEntryId)
  console.log(data)
  if (!data) {
    return null
  }
  return <Block >
    {data.lemma.writtenForm}
    {data.sense.map(s => {
      return <Sense key={s} senseId={s} />
    })}
  </Block >
}
export const PageInner = ({ word }) => {
  const { data } = useWordNet("lemma", word)
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
