
import { NextApiHandler } from "next"
import { getSynsetLemma, getSynsetLexicalEntry, searchWords } from "../../../../lib/expand"
import { searchSenses } from "../../../../lib/searchSenses"
import { getLexicalEntryRelation, getLexicalEntryWordRelation } from "../../../../lib/lexRelation"
import * as dictionary from "../../../../lib/dictionary"

import deepmerge from "deepmerge"
import { EntityType } from "../../../../lib/types"

const wrap = (result:any, type:string, key:string) => {
  return {[type] : { [key] : result }}
}
const getRawResult = (type: EntityType, key:string) => {
  switch (type) {
    case "lexicalEntry": return wrap(dictionary.getLexicalEntry(key), type, key)
    case "lexicalEntryRelation": return getLexicalEntryRelation(key)
    // @ts-ignore
    case "lexicalEntryWordRelation": return getLexicalEntryWordRelation( key)
    case "synset": return wrap(dictionary.getSynset(key), type, key)
    case "synsetIndex": return wrap(dictionary.getSynsetIndex(key), type, key)
    case "synsetLexicalEntry": return wrap(getSynsetLexicalEntry(key), type, key)
    case "synsetLemma": return wrap(getSynsetLemma(key), type, key)
    // case "senseRelated": return wrap(dictionary.getSenseRelated(key), type, key)
    case "syntacticBehaviour": return wrap(dictionary.getSyntacticBehaviour(key), type, key)
    case "sense": return searchSenses([key])
    case "lemma": return searchWords([key])
  }
  throw new Error("invalid type")
}


const getItem = (type: EntityType, keys: string[]) => {
  keys.map(key => {
    return [key, getRawResult(type, key)]
  })
}
const handler: NextApiHandler = async (req, res) => {
  const {type, keys } = req.query
  const results = [keys].flat().map(key => {
    // @ts-ignore
    return getRawResult(type, key)
  })
  res.json(deepmerge.all(results))
}

export default handler

