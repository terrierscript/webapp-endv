import React from "react"
import { Sense } from "./Sense"
import { useWordNet } from "./useWordNet"
import { Block } from "./Block"
import { Box, Spinner } from "@chakra-ui/react"

export const LexicalEntries = ({ lexicalEntryId }) => {
  const data  = useWordNet("lexicalEntry", lexicalEntryId)
  if (!data) {
    return <Box><Spinner />Loading {lexicalEntryId}</Box>
  }
  const { lemma, sense } = data
  return <Block p={4}>
    {lemma.writtenForm} ({lemma.partOfSpeech})
    {sense.map(s => {
      return <Sense key={s} senseId={s} />
    })}
  </Block>
}
