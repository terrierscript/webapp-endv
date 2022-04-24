import { getRelatedWords } from "./relatedWord"

const addSet = (set: Set<string>, append: string[]) => {
  append.map(a => set.add(a))
  return set
}

export const kinderWords = (words: string[]) => {
  const m: {
    [k in string]: Set<string>
  } = {
    word: new Set(),
    synonym: new Set(),
    parents: new Set(),
    children: new Set(),
  }
  words.map(w => {
    return getRelatedWords(w)
  }).forEach(({ word, synonym, parents, children }) => {
    m.word = addSet(m.word, [word])
    m.synonym = addSet(m.synonym, synonym)
    m.parents = addSet(m.parents, parents)
    m.children = addSet(m.children, children)
  })
  return Object.fromEntries(Object.entries(m).map(([k, v]) => {
    return [k, [...v]]
  }))
}
