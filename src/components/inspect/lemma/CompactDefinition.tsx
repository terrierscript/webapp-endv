import { Box, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { Loading } from "../../Loading"
import { Words } from "../synset/Words"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"


export const CompactSynonymus: FC<{ word: string, initialData?: NestedLemmaData }> = ({ word, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  // @ts-ignore
  const synonymus: string[] = useMemo(() => {
    const allSynsets = data?.lexicalEntry?.map(lex => lex.senses?.map(s => {
      return s?.synset
    })).flat()
    const syns = allSynsets?.map(s => s?.lemmas).flat()
    return [
      ...new Set(syns)
    ]
  }, [JSON.stringify(data)])

  return <Box>
    <Heading size="sm">Synonymus</Heading>
    <Words words={synonymus ?? []} />
  </Box>

}
export const CompactDefinition: FC<{ word: string, initialData?: NestedLemmaData, definitionNum?: number }> = ({ word, definitionNum = 3, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  const definitions = useMemo(() => {
    return data?.lexicalEntry?.map(lex => lex.senses?.map(s => {
      return s?.synset
    })).flat()
      .map(s => s?.definition.join(" / ")).flat()
  }, [JSON.stringify(data)])

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

