import { isTruthy } from "typesafe-utils"
import { isQuizWord } from "./isQuizWord"
import { NestedLemmaData } from "../nested/lemma"
import { getNestedSynset } from "../nested/synset"
import { RelationRecord } from "../nested/types"

const unique = (arr: (string | undefined)[]): string[] => {
  const filterd = arr.filter(isTruthy)
  return [
    ...new Set(filterd)
  ]
}

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

export const digSynset = (rel: NestedLemmaData) => {
  const rels = rel?.lexicalEntry?.map(l => l.senses.map(se => {
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
