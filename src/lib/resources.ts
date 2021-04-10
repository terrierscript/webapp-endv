import { getSynsetLemma, getSynsetLexicalEntry, getLemmasExpandItems, getSynsetExpandItems } from "./expand"
import { searchSenses } from "./searchSenses"
import { getLexicalEntryRelation } from "./lexRelation"
import * as dictionary from "./dictionary"
import deepmerge from "deepmerge"
import { EntityType } from "./types"
import { getExpandLexicalEntry } from "./lexicalEntry"
import { getSenseRelations, getSynsetRelations } from "./senseRelation"

const wrap = (result: any, type: string, key: string) => {
  return { [type]: { [key]: result } }
}
const getRawResult = (type: EntityType, key: string) => {
  switch (type) {
    case "lexicalEntry": return getExpandLexicalEntry(key)
    // wrap(dictionary.getLexicalEntry(key), type, key)
    case "lexicalEntryRelation": return getLexicalEntryRelation(key)
    // @ts-ignore
    // case "lexicalEntryWordRelation": return getLexicalEntryWordRelation( key)
    // @ts-ignore
    case "senseRelation": return {
      senseRelation: getSenseRelations([key])
    }
    // @ts-ignore
    case "synsetRelation": return {
      synsetRelation: getSynsetRelations([key])
    }
    // // @ts-ignore
    // case "senseSynsetRelation": return {
    //   senseSynsetRelation: getSenseSynsetRelations([key])
    // }
    case "synsetIndex": return wrap(dictionary.getSynsetIndex(key), type, key)
    case "synsetLexicalEntry": return wrap(getSynsetLexicalEntry(key), type, key)
    case "synsetLemma": return wrap(getSynsetLemma(key), type, key)
    // case "senseRelated": return wrap(dictionary.getSenseRelated(key), type, key)
    case "syntacticBehaviour": return wrap(dictionary.getSyntacticBehaviour(key), type, key)
    case "sense": return searchSenses([key])
    case "lemma": return getLemmasExpandItems([key])
    case "synset": return getSynsetExpandItems([key]) // wrap(dictionary.getSynset(key), type, key)
  }
  throw new Error("invalid type")
}
export const resourceHandler = (type: string, keys: string[]) => {
  const results = keys.map(key => {
    // @ts-ignore
    return getRawResult(type, key)
  })
  return deepmerge.all(results, {
    arrayMerge: (_, sourceArray) => sourceArray
  })
}
