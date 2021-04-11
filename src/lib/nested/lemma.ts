import * as dictionary from "../dictionary/dictionary"
import { LemmaIndex } from "../dictionary/types"


const lexicalEntriesObj = (lexIds?: string[]) => {
  if (!lexIds) {
    return null
  }
  return Object.fromEntries(lexIds?.map(lexId => {
    return [lexId, dictionary.getLexicalEntry(lexId)]
  }))
}
const expandLexicalEntry = (lemma?: LemmaIndex) => {
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
  return expandLexicalEntry(lemma)
}