import { NextApiHandler } from "next"
import { RelationRecord } from "../../../../lib/dictionary/types"
import { getNestedLemma, NestedLemmaData } from "../../../../lib/nested/lemma"
import { getNestedSynset } from "../../../../lib/nested/synset"
import { isTruthy } from 'typesafe-utils'
console.log(isTruthy, isTruthy.toString())
const getWordSynonyms = (word: string, rel: NestedLemmaData) => {
  console.log("isTruthy", isTruthy)
  const _currentLemmas: string[] = rel.lexicalEntry?.map(l => l.senses.map(se => {
    return se?.synset?.lemmas
  })).flat(2).filter(isTruthy) ?? []
  const currentLemmas = [...new Set(_currentLemmas)]
    .filter(f => !!f)
    .filter(f => f !== word)
    .filter((f) => f.split(" ").length == 1) // TODO
    .filter((f) => f.split("-").length == 1) // TODO
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
    parents: [...new Set(parents)],
    children: [...new Set(children)]
  }
}

const dig = (rel: NestedLemmaData) => {
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
const relatedWord = (word: string) => {
  const lemma = getNestedLemma(word)
  const currentLemmas = getWordSynonyms(word, lemma)
  const lv1 = dig(lemma)
  // rel.senses.map(s => {
  //   s.
  // })
  // console.log(word)
  return {
    lv0: currentLemmas,
    lv1,
  }
}
const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  const r = relatedWord(word.toString())
  res.json(r)
}

export default handler

