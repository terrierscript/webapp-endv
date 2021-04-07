import React from "react"
import { SenseItem } from "./Sense"
import { useWordNet } from "./useWordNet"
import { Block } from "./Block"
import { Box, Spinner, Stack } from "@chakra-ui/react"
import { LexicalEntry } from "../../lib/types"

export const LexicalEntries = ({ lexicalEntryId }: { lexicalEntryId: string}) => {
  const data  = useWordNet<LexicalEntry>("lexicalEntry", [lexicalEntryId])
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
