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
    console.log("cach", newCache)
    setCache(newCache)
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
const useEntity = (type: EntityType, key: string | string[]) => {
  const { cache, update } = useContext(WordNetContext)
  const fetcher = async (type, key) => {
    try {
      const caches = Object.entries([key].flat().map(k => [k, cache[type][k]]))
      const lack = Object.entries(caches).filter(([k, v]) => !v).map(([k]) => k)
      if (lack.length === 0) {
        return caches
      }
    
      const url = `/api/search/${type}/${lack.join("/")}`
      const r = await fetch(url).then(f => f.json())
      update(r)
      return Object.entries(key.map(k => [k, r[type][k]]))
    } catch (e) {
      console.error(e)
    }
  }
  return useSWR([type, key], fetcher)
}

const Words = ({ baseWord, words }) => {
  if (!words) {
    return null
  }
  return <HStack shouldWrapChildren wrap={"wrap"}>
    {words.map(word => {
      const color = baseWord !== word ? "blue.500" : "gray.500"
      return <NextLink key={word} href={`/inspect/${word}`} passHref>
        <Link color={color} textDecoration="underline">{word.replaceAll("_", " ")}</Link>
      </NextLink>
    })}
  </HStack>
}

const Glossaries = ({ definition, example }) => {
  return <>
    {definition && <Box>{definition}</Box>}
    {example && <UnorderedList fontSize="xs" >
      {example.map(gl => {
        return <ListItem key={gl}>{gl}</ListItem>
      })}
    </UnorderedList>}
  </>
}

const SenseContents = ({ senses }) => {
  const pts = senses.map(p => p.target)
  const { data, error } = useSWR(`/api/search/synset/${pts.join("/")}`)
  const [offsetData, setOffsetData] = useState([])
  // console.log(data)
  useEffect(() => {
    if (!data) { return }
    const senses = Object.values(data)

    setOffsetData(senses)
  }, [data])

  if (!data) {
    return <Spinner />
  }
  return <>{offsetData.map(off => {
    return <SenseBlock sense={off} />
  })}</>
}

const Senses = ({ relations }) => {
  const relTypes = useMemo(() => {
    const rt = relations.map(r => r.relType)
    return [...new Set<string>(rt)]
  }, [relations])

  const grouped = relations
  // console.log(relations)
  if (!relations) {
    return null
  }
  return <Accordion allowToggle allowMultiple>
    {relTypes.map(rel => {
      const senses = relations.filter(r => r.relType === rel)
      return <AccordionItem key={rel}>{({ isExpanded }) => (
        <>
          <AccordionButton>
            {rel.replaceAll("_", " ")} ({senses.length})
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {isExpanded ? <SenseContents senses={senses} /> : <Spinner />}
          </AccordionPanel>
        </>
      )}
      </AccordionItem>
    })}
  </Accordion>
}

const SenseBlock = ({ baseWord = "", sense }) => {
  const senseItem = useEntity("sense", sense)
  const { members, definition, example, synsetRelation } = sense
  const [more, setMore] = useState(false)
  return <Box border={1} borderRadius={4} borderColor="gray.200" borderStyle="solid" p={4}>
    <Box>
      <Words words={members} baseWord={baseWord} />
      <Glossaries
        definition={definition}
        example={example}
      />
      {more ? <Senses relations={synsetRelation} /> : <Button onClick={() => setMore(true)}>
        More
      </Button>}
    </Box>
  </Box>

}

const longPart = (p) => {
  switch (p) {
    case "n": return "Noun"
    case "v": return "Verb"
    case "a": return "Adjective"
    case "r": return "Adverb"
    case "s": return "Adjective Satellite"
    case "c": return "Conjunction"
    case "p": return "Adposition(Preposition, postposition, etc.)"
    case "x": return "Other(inc.particle, classifier, bound morphemes, determiners)"
    case "u": return "Unknown"
  }
  return "?"
}


const EntryBlock = ({ baseWord, entry }) => {
  const forms = entry.form ? `(${entry.form.map(f => f.writtenForm).join(",")})` : ""
  console.log(entry)
  return <Stack>
    <Heading size="xs">
      {/* ({longPart(entry.lemma.partOfSpeech)} ) */}
      [{entry.lemma.partOfSpeech}] {entry.lemma.writtenForm} {forms}
    </Heading>
    <Stack>
      {entry.sense.map((sense) => {
        return <Box key={sense.id}>
          {/* <SenseBlock sense={sense.reference} baseWord={baseWord} /> */}
        </Box>
      })}
    </Stack>
  </Stack>
}

export const Entry = ({ word, lexIds }) => {
  const { data } = useEntity("lexicalEntry", lexIds)
  if (!data) {
    return null
  }
  return <Box>
    <Stack>
      <Heading>{word}</Heading>
      <Stack>
        {data.map((ent, k) => {
          return <EntryBlock key={k} baseWord={word} entry={ent} />
        })}
      </Stack>
    </Stack>
  </Box>
}

export const PageInner = ({ word }) => {
  const { data } = useEntity("lemma", word)
  if (!data) {
    return null
  }
  return <Entry word={word} lexIds={data.lexicalEntry} />
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
