import { dictionary } from "../dictionary/dictionary"
import { LemmaIndex } from "../dictionary/types"
import { getNestedLexicaEntry } from "./lexicaEntry"


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
    return {}
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