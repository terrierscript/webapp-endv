import { Sense } from "@terrierscript/normalized-global-wordnet-en"
import dictionary from "../dictionary/dictionary"
import { Relation, RelationRecord, RelationType } from "./types"

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

export const convertGroupedRelations = (relations: Relation[], type: RelationType): RelationRecord[] => {
  return Array.from(groupingRelationMap(relations).entries())
    .map(([relType, targets]): RelationRecord => {
      return { relType, targets, type: type }
    })

}

export const getSenseRelation = (senseId: string): RelationRecord[] => {
  const sense = dictionary.getSense(senseId)
  if (!sense) {
    return []
  }
  const { senseRelation } = getRelations(sense)
  const senseIndexRelation = getSenseIndexRelation(sense.id)
  const senseRecord = convertGroupedRelations([
    ...senseRelation ?? [],
    ...senseIndexRelation ?? [],
  ], "sense")
  return senseRecord
}


export const getSynsetRelation = (synsetId: string): RelationRecord[] => {
  const synset = dictionary.getSynset(synsetId)
  if (!synset) {
    return []
  }

  return convertGroupedRelations(synset.synsetRelation ?? [], "synset")
}
