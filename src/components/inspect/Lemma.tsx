import React from "react"
import {  useWordNet } from "./useWordNet"
import { Block } from "./Block"
import { LexicalEntries } from "./LexicalEntries"


export const Lemma = ({ word }) => {
  const data = useWordNet("lemma", word)
  // console.log(data)
  if (!data) {
    return null
  }
  const ls = data.lexicalEntry
  return <Block>{ls?.map(l => {
    return <LexicalEntries key={l} lexicalEntryId={l} />
  })}</Block>
}
