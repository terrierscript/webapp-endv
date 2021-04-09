import React, { useMemo } from "react"
import { SenseItem } from "../sense/Sense"
import { useWordNet } from "../useWordNet"
// import { useSynsetGroupedRelation } from "../useSynsetGroupedRelation"
import { Block } from "../Block"
import { Box, Spinner, Stack } from "@chakra-ui/react"
import { LexicalEntry, Sense } from "../../../lib/types"

// const Relations = ({ lexicalEntry }: any) => {
//   useSynsetGroupedRelation({ lexicalEntry })
//   return null
// }

export const LexicalEntries = ({ lexicalEntryId }: { lexicalEntryId: string }) => {
  const data = useWordNet<LexicalEntry>("lexicalEntry", [lexicalEntryId])
  if (!data) {
    return <Box><Spinner />Loading {lexicalEntryId}</Box>
  }
  const lex = data[lexicalEntryId]
  const { lemma, sense } = lex
  return <Block p={4}>
    {lemma.writtenForm} ({lemma.partOfSpeech})
    <Stack>
      {sense?.map(s => {
        return <SenseItem key={s} senseId={s} />
      })}
    </Stack>
  </Block>
}
