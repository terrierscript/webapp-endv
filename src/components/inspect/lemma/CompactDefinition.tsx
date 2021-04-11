import { Box, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { LexicalEntry, LexicalEntryIndex, Sense, Synset, SynsetLemma } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"
import { Words } from "../synset/Words"
import { useWordNetQuery } from "../useWordNet"

const useSynonyms = (word: string, synsets: Synset[]) => {
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

const useDefinitions = (word: string) => {
  const lemma = useWordNetQuery<LexicalEntryIndex>("lemma", [word])
  const lex = useWordNetQuery<LexicalEntry>("lexicalEntry", () => lemma?.[word]?.lexicalEntry)
  const sense = useWordNetQuery<Sense>("sense", () => lex && Object
    .values(lex)
    .map(l => l?.sense).flat()
    .filter((l): l is string => !!l)
  )
  const synset = useWordNetQuery<Synset>("synset", () => sense && Object.values(sense).map(s => s.synset)
    .filter((l): l is string => !!l)
  )
  const synonymus = useSynonyms(word, Object.values(synset ?? {}))
  const definitions = useMemo(() => synset && Object.values(synset).map(syn => syn.definition).flat(), [JSON.stringify(synset)])
  return { lemma, synonymus, definitions }
}

export const CompactDefinition: FC<{ word: string }> = ({ word }) => {
  const { lemma, synonymus, definitions } = useDefinitions(word)
  const length = definitions?.length ?? 0
  const num = 3
  if (!lemma) {
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
        {definitions?.concat().slice(0, num).map(def => {
          return <ListItem key={def}>{def}</ListItem>
        })}
      </UnorderedList>
      <Box p={2}>
        {length > num && `and (${length - num} definitions)`}
      </Box>
    </Box>
  </Stack>
}