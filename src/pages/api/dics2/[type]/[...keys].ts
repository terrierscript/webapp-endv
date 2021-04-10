
import { NextApiHandler } from "next"
import { getSynsetLemma, getSynsetLexicalEntry, getLemmasExpandItems, getSynsetExpandItems } from "../../../../lib/expand"
import { searchSenses } from "../../../../lib/searchSenses"
import { getLexicalEntryRelation, getLexicalEntryWordRelation } from "../../../../lib/lexRelation"
// import { getSenseRelation } from "../../../../lib/senseRelation"
import * as dictionary from "../../../../lib/dictionary"

import deepmerge from "deepmerge"
import { EntityType } from "../../../../lib/types"
import { getExpandLexicalEntry } from "../../../../lib/lexicalEntry"
import { getSenseRelations, getSynsetRelations } from "../../../../lib/senseRelation"

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
const resourceHandler = (type: string, keys: string[]) => {
  const results = keys.map(key => {
    // @ts-ignore
    return getRawResult(type, key)
  })
  return deepmerge.all(results, {
    arrayMerge: (_, sourceArray,) => sourceArray
  })
}

const handler: NextApiHandler = async (req, res) => {
  const { type, keys } = req.query
  const k = [keys].flat().map(k => k.split(",")).flat()

  const result = resourceHandler(type.toString(), k)
  res.json(result)
}

export default handler

