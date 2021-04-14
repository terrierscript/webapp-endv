import { NextApiHandler } from "next"
import { RelationRecord } from "../../../../lib/dictionary/types"
import { getNestedLemma, NestedLemmaData } from "../../../../lib/nested/lemma"
import { getNestedSynset } from "../../../../lib/nested/synset"
import { isTruthy } from 'typesafe-utils'

const isQuizWord = (f: string) => {
  if (!f) return false
  // if (f === word) return false
  if (f.split(" ").length !== 1) return false
  if (f.split("-").length !== 1) return false
  if (/[A-Z]/.test(f)) return false
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
const relatedWords = (words: string[]) => {
  const m: { [k in string]: Set<string> } = {
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

const digCousinWords = (words: string[]) => {
  const c = relatedWords(words)
  return c.children
}

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
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
const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  const [w, l1, l2] = relatedWord(word.toString())

  res.json({
    word: w,
    answer: random(l1),
    diff: random(l2)
  })
}

export default handler

