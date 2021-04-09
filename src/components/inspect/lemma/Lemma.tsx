import React, { FC } from "react"
import { useWordNet } from "../useWordNet"
import { Block } from "../Block"
import { LexicalEntries } from "../lexicalEntry/LexicalEntries"
import { LexicalEntryIndex } from "../../../lib/types"


export const Lemma: FC<{ word: string }> = ({ word }) => {
  const data = useWordNet<LexicalEntryIndex>("lemma", [word])
  if (!data) {
    return null
  }
  const lemm = data[word]
  if (!lemm) {
    return null
  }
  const ls = lemm.lexicalEntry
  return <Block >{ls?.map(l => {
    return <LexicalEntries key={l} lexicalEntryId={l} />
  })}</Block>
}
