import { Box, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { Loading } from "../../Loading"
import { Words } from "../synset/Words"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"


export const CompactSynonymus: FC<{ word: string, initialData?: NestedLemmaData }> = ({ word, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  const allSynsets = useMemo(() => {
    return data?.lexicalEntry?.map(lex => lex?.senses?.map(s => {
      return s?.synsets
    })).flat()
  }, [JSON.stringify(data)])
  // @ts-ignore
  const synonymus: string[] = useMemo(() => {
    const syns = allSynsets?.map(s => s?.lemmas).flat()
    return [
      ...new Set(syns)
    ]
  }, [allSynsets])

  return <Box>
    <Heading size="sm">Synonymus</Heading>
    <Words words={synonymus ?? []} />
  </Box>

}
export const CompactDefinition: FC<{ word: string, initialData?: NestedLemmaData, definitionNum?: number }> = ({ word, definitionNum = 3, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  const allSynsets = useMemo(() => {
    return data?.lexicalEntry?.map(lex => lex.senses?.map(s => {
      return s?.synsets
    })).flat()
  }, [JSON.stringify(data)])
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
    <CompactSynonymus {...{ word, initialData }} />
  </Stack>
}

