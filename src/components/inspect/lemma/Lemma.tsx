import React, { FC } from "react"
import { useWordNet } from "../useWordNet"
import { Block } from "../Block"
import { LexicalEntries } from "../lexicalEntry/LexicalEntries"
import { LexicalEntryIndex } from "../../../lib/types"
import { Box, Spinner } from "@chakra-ui/react"


export const Lemma: FC<{ word: string }> = ({ word }) => {
  const data = useWordNet<LexicalEntryIndex>("lemma", [word])
  if (!data) {
    return <Spinner />
  }
  const lemm = data[word]
  if (!lemm) {
    return <Box>😵</Box>
  }
  const ls = lemm.lexicalEntry
  return <Block >{ls?.map(l => {
    return <LexicalEntries key={l} lexicalEntryId={l} />
  })}</Block>
}
