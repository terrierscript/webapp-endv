import { isTruthy } from "typesafe-utils"
import { isQuizWord } from "./isQuizWord"
import { getNestedLemma, NestedLemmaData } from "../nested/lemma"

export const getWordSynonyms = (word: string, rel: NestedLemmaData) => {
  const _currentLemmas: string[] = rel.lexicalEntry?.map(l => l.senses.map(se => {
    return se?.synset?.lemmas
  })).flat(2)
    .filter(isTruthy) ?? []
  const currentLemmas = [...new Set(_currentLemmas)]
    .filter(isQuizWord)
  return currentLemmas
}

export const getSynonym = (word: string) => {
  const lemma = getNestedLemma(word)
  const synonym = getWordSynonyms(word, lemma)
  return synonym.filter(x => x !== word)
}
