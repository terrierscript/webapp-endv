import * as dictionary from "../dictionary/dictionary"
import { getNestedSense } from "./sense"


const senseObj = (senseIds?: string[]) => {
  if (!senseIds) {
    return null
  }
  return senseIds?.map(lexId => {
    return getNestedSense(lexId)
  })
  // return Object.fromEntries(senseIds?.map(lexId => {
  //   return [lexId, getNestedSense(lexId)]
  // }))
}

export const getNestedLexicaEntry = (lexId: string) => {
  const lex = dictionary.getLexicalEntry(lexId)
  const sense = senseObj(lex?.sense)
  return {
    ...lex,
    sense // overwrite sense
  }
}
