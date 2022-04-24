import dictionary from "../dictionary/dictionary"
import { getNestedLexicaEntry } from "./lexicaEntry"
import { LemmaIndex } from "./types"


const lexicalEntriesObj = (lexIds?: string[]) => {
  if (!lexIds) {
    return null
  }
  return lexIds?.map(lexId => {
    return getNestedLexicaEntry(lexId)
  })
  // return Object.fromEntries(lexIds?.map(lexId => {
  //   return [lexId, getNestedLexicaEntry(lexId)]
  // }))
}

const expandLemma = (lemma?: LemmaIndex) => {
  if (!lemma) {
    return null
  }
  const lexIds = lemma.lexicalEntry
  const formLexIds = lemma.form
  const lexs = lexicalEntriesObj(lexIds)
  const formLex = lexicalEntriesObj(formLexIds)
  return {
    ...(lexs && { lexicalEntry: lexs }),
    ...(formLex && { form: formLex }),
  }
}
export const getNestedLemma = (word: string) => {
  const lemma = dictionary.getLemma(word)

  return expandLemma(lemma)
}

export type NestedLemmaData = ReturnType<typeof getNestedLemma>

// export interface NestedLemmaData extends NestedLemmaDataRT {}