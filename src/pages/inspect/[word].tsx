import { AddIcon } from "@chakra-ui/icons"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Container, Heading, HStack, Link, List, ListItem, Spinner, Stack, UnorderedList } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import  NextLink from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { searchLemma } from "../../lib/dics"


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
  const pts = senses.map( p => p.target)
  const { data, error } = useSWR(`/api/search/synset/${pts.join("/")}`)
  const [offsetData, setOffsetData] = useState([])
  console.log(data)
  useEffect(() => {
    if (!data) { return }
    const senses = Object.values(data)

    setOffsetData(senses)
  },[data])

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
            {rel.replaceAll("_", " ")}
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
  const { members, definition, example, synsetRelation } = sense
  return <Box border={1} borderRadius={4} borderColor="gray.200" borderStyle="solid" p={4}>
    <Box>
      <Words words={members} baseWord={baseWord} />
      <Glossaries
        definition={definition}
        example={example}
      />
      <Senses relations={synsetRelation} />
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
  return <Box>
    <Heading size="xs">
      {entry.lemma.writtenForm} ({longPart(entry.lemma.partOfSpeech)})
    </Heading>
    <Stack>
      {entry.sense.map((sense) => {
        return <Box key={sense.id}>
          <SenseBlock sense={sense.reference} baseWord={baseWord}/>
        </Box>
      })}
    </Stack>
  </Box>
}

export const Page = ({ word, entry }) => {
  if (!entry) {
    return <Box>not found</Box>
  }
  return <Container>
    <Box>
      <Heading>{word}</Heading>
      {entry.map((ent,k) => {

        return <EntryBlock key={k} baseWord={word} entry={ent} />
      })}
    </Box>
  </Container>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  const entry = searchLemma(word.toString())
  return {
    props: { word, entry }
  }
}

export default Page