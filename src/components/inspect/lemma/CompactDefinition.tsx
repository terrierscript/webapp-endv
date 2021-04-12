import { Box, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { Synset, SynsetLemma } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"
import { Words } from "../synset/Words"
import { useWordNetQuery } from "../useWordNet"
import { useWordNetPartials } from "../useDefinitions"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"

export const useSynonyms = (word: string, synsets: Synset[]) => {
  const synsetIds = synsets.map(s => s.id)
  const lemmas = useWordNetQuery<SynsetLemma>("synsetLemma", synsetIds)
  const synonyms = useMemo(() => {
    if (!lemmas) {
      return null
    }

    const lems = Object.values(lemmas).flat()
    return [...new Set(lems)].filter(w => w !== word)
  }, [Object.keys(lemmas ?? {}).join("_")])
  return synonyms
}

export const CompactDefinition: FC<{ word: string, initialData?: NestedLemmaData, definitionNum?: number }> = ({ word, definitionNum = 3, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  const allSynsets = useMemo(() => {
    return data?.lexicalEntry?.map(lex => lex.sense?.map(s => {
      return s?.synset
    })).flat()
  }, [JSON.stringify(data)])
  // @ts-ignore
  const synonymus: string[] = useMemo(() => {
    const syns = allSynsets?.map(s => s?.lemma).flat()
    return [
      ...new Set(syns)
    ]
  }, [allSynsets])
  const definitions = useMemo(() => {
    return allSynsets?.map(s => s?.definition.join(" / ")).flat()
  }, [allSynsets])

  const length = definitions?.length ?? 0

  if (!data) {
    return <Loading>Loading</Loading>
  }
  if (!definitions) {
    return <Box>Not found</Box>
  }

  return <Stack p={2}>
    <Box>
      <Heading size="sm">Synonymus</Heading>
      <Words words={synonymus ?? []} />
    </Box>
    <Box>
      <Heading size="sm">Definitions</Heading>
      <UnorderedList>
        {definitions?.concat().slice(0, definitionNum).map(def => {
          return <ListItem key={def}>{def}</ListItem>
        })}
      </UnorderedList>
      <Box p={2}>
        {length > definitionNum && `and (${length - definitionNum} definitions)`}
      </Box>
    </Box>
  </Stack>
}