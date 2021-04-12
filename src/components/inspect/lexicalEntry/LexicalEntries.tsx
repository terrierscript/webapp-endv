import React from "react"
import { SenseItem } from "../sense/Sense"
import { Box, Stack } from "@chakra-ui/react"
import { LexicalEntry } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"
import { logPartOfSpeech } from "./longPart"
import { useWordNetQuery } from "../useWordNet"

export const LexicalEntries = ({ lexicalEntryId }: { lexicalEntryId: string }) => {
  const data = useWordNetQuery<LexicalEntry>("lexicalEntry", [lexicalEntryId])
  if (!data) {
    return <Loading>Loading {lexicalEntryId}</Loading>
  }
  const lex = data[lexicalEntryId]
  const { lemma, sense } = lex
  return <Box p={4}>
    {logPartOfSpeech(lemma.partOfSpeech)}
    <Stack>
      {sense?.map(s => {
        return <SenseItem key={s} senseId={s} />
      })}
    </Stack>
  </Box>
}
