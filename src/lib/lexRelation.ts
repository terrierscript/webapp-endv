import * as dictionary from "./dictionary"

import { getSenses } from "./expand"
import { Relation, RelationMap, Sense, SenseRelation } from "./types"
import { senseIdToLexId } from "./util"

const groupingRelation = (relations: Relation[] = []): RelationMap => {
  const map = new Map()
  relations.map((rel) => {
    const { relType } = rel
    const m = map.get(relType) ?? []
    map.set(relType, [...m, rel.target])
  })
  return Object.fromEntries(map)
}

const getSenseRelations = (sense: Sense) => {
  const { synset, senseRelation } = sense
  const senseSynset = dictionary.getSynset(synset)
  // @ts-ignore
  const synsetRelation: Relation[] = senseSynset.synsetRelation
  return { senseRelation, synsetRelation }
}



const getSenseRelType = (sense: Sense) => {
  const { senseRelation, synsetRelation } = getSenseRelations(sense)
  const relations = {
    sense: groupingRelation(senseRelation ?? []),
    synset: groupingRelation(synsetRelation ?? [])
  }
  return relations
}

export const getLexicalEntryRelation = (key: string) => {
  const lex = dictionary.getLexicalEntry(key)
  const senses = getSenses(lex?.sense ?? [])
  const senseRelation = Object.fromEntries(
    Object.values(senses).map(sense => [sense.id, getSenseRelType(sense)])
  )
  return senseRelation
}

const expandRelType = (baseSense: Sense) => {
  const { sense, synset } = getSenseRelType(baseSense)
  const senseExpand = Object.fromEntries(Object.entries(sense).map(([relType, senseIds]) => {
    // @ts-ignore
    const sense = Object.fromEntries(senseIds.map(id => {
      const lexId = senseIdToLexId(id)
      const lex = dictionary.getLexicalEntry(lexId)
      return [id, { lemma: lex?.lemma.writtenForm }]
    }))
    return [relType, sense]
  }))
  const synsetExpand = Object.fromEntries(Object.entries(synset).map(([relType, synsetId]) => {
    return [relType, Object.fromEntries(synsetId.map(s => {
      const syns = dictionary.getSynset(s ?? "")
      const synsetLex = dictionary.getSynsetIndex(syns?.id ?? "") ?? { lexicalEntry: [] }
      const ll = synsetLex.lexicalEntry.map(l => dictionary.getLexicalEntry(l)?.lemma.writtenForm)
      return [s, ll]
    }))]
  }))
  return {
    sense: senseExpand,
    synset: synsetExpand
  }
}

export const getLexicalEntryWordRelation = (key: string) => {
  const lex = dictionary.getLexicalEntry(key)
  const senses = getSenses(lex?.sense ?? [])
  const senseRelation = Object.fromEntries(
    Object.values(senses)
      .map(sense => {
        const relTypes = expandRelType(sense)
        return [sense.id, relTypes]
      })
  )
  return senseRelation
}


