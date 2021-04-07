import * as dictionary from "./dictionary"
import { Mapping, Relation, Sense, RelationRecord } from "./types"

const groupingRelationMap = (relations: Relation[] = []) => {
  const map = new Map<string, string[]>()
  relations.map((rel) => {
    const { relType } = rel
    const m = map.get(relType) ?? []
    map.set(relType, [...m, rel.target])
  })
  return map
}

const getRelations = (sense: Sense) => {
  const { synset, senseRelation } = sense
  const senseSynset = dictionary.getSynset(synset)
  // @ts-ignore
  const synsetRelation: Relation[] = senseSynset.synsetRelation
  return { senseRelation, synsetRelation }
}


const getSenseRelation = (senseId: string): RelationRecord[] => {
  const sense = dictionary.getSense(senseId)
  if (!sense) {
    return []
  }
  const { senseRelation, synsetRelation } = getRelations(sense)
  const senseRecord = Array.from(groupingRelationMap(senseRelation).entries())
    .map(([relType, targets]): RelationRecord => {
      return { relType, targets, type: "sense" }
    })
  const synsetRecord = Array.from(groupingRelationMap(synsetRelation).entries())
    .map(([relType, targets]): RelationRecord => {
      return { relType, targets, type: "synset" }
    })

  return [
    ...senseRecord
    // , ...synsetRecord
  ]
}

export const getSenseRelations = (senseIds: string[]): Mapping<RelationRecord[]> => {
  return Object.fromEntries(senseIds.map(s => {
    return [s, getSenseRelation(s)]
  }))
}



const getSynsetRelation = (synsetId: string): RelationRecord[] => {
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

export const getSynsetRelations = (synsetIds: string[]): Mapping<RelationRecord[]> => {
  return Object.fromEntries(synsetIds.map(s => {
    return [s, getSynsetRelation(s)]
  }))
}