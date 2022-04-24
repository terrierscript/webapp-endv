import { isTruthy } from "typesafe-utils"
import dictionary from "../dictionary/dictionary"

import { getNestedSense, NestedSenseData } from "./sense"

const senseObj = (senseIds?: string[]): NestedSenseData[] => {
  if (!senseIds) {
    return []
  }

  return senseIds?.map(lexId => {
    return getNestedSense(lexId)
  }).filter(isTruthy)
  // return Object.fromEntries(senseIds?.map(lexId => {
  //   return [lexId, getNestedSense(lexId)]
  // }))
}

export const getNestedLexicaEntry = (lexId: string) => {
  const lex = dictionary.getLexicalEntry(lexId)
  const { sense, ...rest } = lex ?? {}
  const senses = senseObj(sense)
  return {
    ...rest,
    senses // overwrite sense
  }
}

export type NestedLexicaEntryData = ReturnType<typeof getNestedLexicaEntry> & {
  sense?: undefined
}

