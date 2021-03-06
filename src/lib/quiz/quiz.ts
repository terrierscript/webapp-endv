import { RelationRecord } from "../dictionary/types"
import { getNestedLemma, NestedLemmaData } from "../nested/lemma"
import { getNestedSynset } from "../nested/synset"
import { isTruthy } from 'typesafe-utils'
import { shuffle } from "./shuffle"
import { filterFuzzyUnmatch } from "./filterFuzzyUnmatch"
import { QuizSet } from "./QuizSet"
import { arrayIntersect } from "./arrayIntersect"

const isQuizWord = (f: string) => {
  if (!f) return false
  // if (f === word) return false
  // if (f.split(" ").length !== 1) return false
  if (f.split("-").length !== 1) return false
  if (/[A-Z]/.test(f)) return false
  if (/[0-9]/.test(f)) return false
  return true

}
const getWordSynonyms = (word: string, rel: NestedLemmaData) => {
  const _currentLemmas: string[] = rel.lexicalEntry?.map(l => l.senses.map(se => {
    return se?.synset?.lemmas
  })).flat(2)
    .filter(isTruthy) ?? []
  const currentLemmas = [...new Set(_currentLemmas)]
    .filter(isQuizWord)
  return currentLemmas
}
const unique = (arr: (string | undefined)[]): string[] => [...new Set(arr.filter(isTruthy))]
const filterParentAndChildren = (rels: RelationRecord[]) => {
  let parents: string[] = []
  let children: string[] = []
  rels.map(rel => {
    if (rel.relType === "hypernym") {
      parents = [...parents, ...rel.targets]
    }
    if (rel.relType === "hyponym") {
      children = [...children, ...rel.targets]
    }
  })
  return {
    parents: [...new Set(parents)].filter(isQuizWord),
    children: [...new Set(children)].filter(isQuizWord)
  }
}
const digSynset = (rel: NestedLemmaData) => {
  const rels = rel.lexicalEntry?.map(l => l.senses.map(se => {
    return se?.synset?.relations
  })).flat(2).filter(rel => !!rel)
    // @ts-ignore
    .map((rel: RelationRecord) => {
      return {
        ...rel,
        targets: unique(rel.targets.map(t => {
          return getNestedSynset(t)?.lemmas
        }).flat())
      }
    }) ?? []
  const pc = filterParentAndChildren(rels)
  return pc
}


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

const getRelatedWords = (word: string) => {
  const lemma = getNestedLemma(word)
  const synonym = getWordSynonyms(word, lemma)
  const { parents, children } = digSynset(lemma)
  return {
    word, synonym, parents, children
  }
}
const addSet = (set: Set<string>, append: string[]) => {
  append.map(a => set.add(a))
  return set
}
const kinderWords = (words: string[]) => {
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

const relatedWord = (word: string) => {
  const { synonym, parents } = getRelatedWords(word)
  // const d1 = relatedWords(parents)
  // const d2 = relatedWords(d1.parents)
  const levels = [
    [word], synonym, parents,
    // d1.children, d2.children
  ]
  return levelIntersect(levels)
}

export const getQuizCandidate = (word: string) => {
  console.time("1")
  const [w, l1, l2] = relatedWord(word.toString())
  console.timeEnd("1")
  console.time("2")
  const d1 = kinderWords(shuffle(l2).slice(0,5))
  console.timeEnd("2")
  console.time("3")
  const collects = l1
  const incollects = arrayIntersect(d1.children, new Set([...l1, ...l2, ...w]))
  console.timeEnd("3")
  return {
    word,
    collects,
    incollects,
    debug: { l1, l2 }
  }
}

