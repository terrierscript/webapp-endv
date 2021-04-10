import { Box, ListItem, UnorderedList } from "@chakra-ui/react"
import React, { FC } from "react"
import { LexicalEntry, LexicalEntryIndex, Sense, Synset } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"
import { useWordNetQuery } from "../useWordNet"

export const CompactLemma: FC<{ word: string }> = ({ word }) => {
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
  const definitions = synset && Object.values(synset).map(syn => syn.definition).flat()
  const length = definitions?.length ?? 0

  const num = 3
  if (!lemma) {
    return <Loading>Loading</Loading>
  }
  if (!definitions) {
    return <Box>Not found</Box>
  }

  return <Box p={2}>
    <UnorderedList>
      {definitions?.concat().slice(0, num).map(def => {
        return <ListItem key={def}>{def}</ListItem>
      })}
    </UnorderedList>
    <Box p={2}>
      {length > num && `and (${length - num} definitions)`}
    </Box>
  </Box>
}