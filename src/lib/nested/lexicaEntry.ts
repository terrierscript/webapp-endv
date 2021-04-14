import * as dictionary from "../dictionary/dictionary"
import { getNestedSense, NestedSenseData } from "./sense"

const filter = <T>(items: (T | null | undefined)[]): T[] => {
  return items.filter((item): item is T => {
    return item !== null && item !== undefined
  })
}

const senseObj = (senseIds?: string[]) => {
  if (!senseIds) {
    return []
  }
  return filter(senseIds?.map(lexId => {
    return getNestedSense(lexId)
  }))
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