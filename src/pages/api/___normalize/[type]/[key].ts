
import { NextApiHandler } from "next"
import { searchSenses, searchWords } from "../../../../lib/dics"

import dictionary from "@terrierscript/normalized-global-wordnet-en"
import deepmerge from "deepmerge"
import { searchWord } from "../../../../lib/___dic2"

// type EntityType = "sense" | "senseRelated" | "synset" | "lemma" | "lexicalEntry"

// const wrap = (result, type, key) => {
//   return {[type] : { [key] : result }}
// }
const getRawResult = (type, key) => {
  switch (type) {
    case "lemma": return searchWord(key)
  }
}

// const getItem = (type:string, keys: string[]) => {
//   keys.map(key => {
//     return [key, getRawResult(type, key)]
//   })
// }

const handler: NextApiHandler = async (req, res) => {
  const { type, key } = req.query
  
  const results =getRawResult(type, key.toString())
  res.json(results)
}

export default handler