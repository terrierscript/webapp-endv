import React, { useMemo } from "react"
import { SenseItem } from "../sense/Sense"
import { useWordNet } from "../useWordNet"
// import { useSynsetGroupedRelation } from "../useSynsetGroupedRelation"
import { Block } from "../Block"
import { Box, Stack } from "@chakra-ui/react"
import { LexicalEntry, Sense } from "../../../lib/types"
import { Loading } from "../../Loading"

export const LexicalEntries = ({ lexicalEntryId }: { lexicalEntryId: string }) => {
  const data = useWordNet<LexicalEntry>("lexicalEntry", [lexicalEntryId])
  if (!data) {
    return <Loading>Loading {lexicalEntryId}</Loading>
  }
  const lex = data[lexicalEntryId]
  const { lemma, sense } = lex
  return <Box p={4}>
    {lemma.writtenForm} ({lemma.partOfSpeech})
    <Stack>
      {sense?.map(s => {
        return <SenseItem key={s} senseId={s} />
      })}
    </Stack>
  </Box>
}
