import * as dictionary from "../dictionary/dictionary"
import { Mapping, Relation, Sense, RelationRecord } from "../dictionary/types"

const groupingRelationMap = (relations: Relation[] = []) => {
  const map = new Map<string, Set<string>>()
  relations.map((rel) => {
    const { relType } = rel
    const s = map.get(relType) ?? new Set()
    s.add(rel.target)
    map.set(relType, s)
  })
  return new Map(
    Array.from(map.entries()).map(([key, value]) => {
      return [key, Array.from(value)]
    })
  )
}

const getRelations = (sense: Sense) => {
  const { synset, senseRelation } = sense
  const senseSynset = dictionary.getSynset(synset)
  // @ts-ignore
  const synsetRelation: Relation[] = senseSynset.synsetRelation
  return { senseRelation, synsetRelation }
}

const getSenseIndexRelation = (senseId: string) => {
  const senseToSynsetRelation = dictionary.getSenseIndex(senseId)
  const rel = senseToSynsetRelation?.map(s => ({
    relType: s.relType,
    target: s.sense,
  })).filter(s => s.relType === "derivation")
  return rel

}
const getSenseRelation = (senseId: string): RelationRecord[] => {
  const sense = dictionary.getSense(senseId)
  if (!sense) {
    return []
  }
  const { senseRelation } = getRelations(sense)
  const senseIndexRelation = getSenseIndexRelation(sense.id)
  const senseRecord = Array.from(groupingRelationMap([
    ...senseRelation ?? [],
    ...senseIndexRelation ?? [],
  ]).entries())
    .map(([relType, targets]): RelationRecord => {
      return { relType, targets, type: "sense" }
    })

  return [
    ...senseRecord
  ]
}

export const getSenseRelations = (senseIds: string[]): Mapping<RelationRecord[]> => {
  return Object.fromEntries(senseIds.map(s => {
    return [s, getSenseRelation(s)]
  }))
}

export const getSynsetRelation = (synsetId: string): RelationRecord[] => {
  const synset = dictionary.getSynset(synsetId)
  if (!synset) {
    return []
  }

  const synsetRecord = Array.from(groupingRelationMap(synset.synsetRelation).entries())
    .map(([relType, targets]): RelationRecord => {
      return { relType, targets, type: "synset" }
    })

  return [...synsetRecord]
}
