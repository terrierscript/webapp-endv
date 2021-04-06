
import { NextApiHandler } from "next"
import { searchSenses, searchWords } from "../../../../lib/dics"

import dictionary from "@terrierscript/normalized-global-wordnet-en"
import deepmerge from "deepmerge"

type EntityType = "sense" | "senseRelated" | "synset" | "lemma" | "lexicalEntry"

const wrap = (result, type, key) => {
  return {[type] : { [key] : result }}
}
const getRawResult = (type, key) => {
  switch (type) {
    case "lexicalEntry": return wrap(dictionary.getKexicalEntry(key), type, key)
    case "synset": return wrap(dictionary.getSynset(key), type, key)
    case "synsetIndex": return wrap(dictionary.getSynsetIndex(key), type, key)
    case "senseRelated": return wrap(dictionary.getSenseRelated(key), type, key)
    case "syntacticBehaviour": return wrap(dictionary.getSyntacticBehaviour(key), type, key)
    case "sense": return searchSenses([key])
    case "lemma": return searchWords([key])
  }
}


const getItem = (type:string, keys: string[]) => {
  keys.map(key => {
    return [key, getRawResult(type, key)]
  })
}
const handler: NextApiHandler = async (req, res) => {
  const {type, keys } = req.query
  const results = [keys].flat().map(key => {
    return getRawResult(type, key)
  })
  res.json(deepmerge.all(results))
}

export default handler