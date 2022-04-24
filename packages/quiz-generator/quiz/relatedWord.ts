import { getNestedLemma } from "../nested/lemma"
import { getSynonym } from "./synonym"
import { digSynset } from "./synset"
const levelIntersect = (targets: string[][]) => {
  const dups = new Set()
  const results: string[][] = []
  targets.forEach(t => {
    const f = t.filter(item => !dups.has(item))
    results.push(f)
    t.forEach(tt => dups.add(tt))
  })
  return results
}

export const getRelatedWords = (word: string) => {
  const lemma = getNestedLemma(word)
  const synonym = getSynonym(word)
  const { parents, children } = digSynset(lemma)
  return {
    word, synonym, parents, children
  }
}

export const relatedWord = (word: string) => {
  const { synonym, parents } = getRelatedWords(word)
  // const d1 = relatedWords(parents)
  // const d2 = relatedWords(d1.parents)
  const levels = [
    [word], synonym, parents,
    // d1.children, d2.children
  ]
  return levelIntersect(levels)
}
