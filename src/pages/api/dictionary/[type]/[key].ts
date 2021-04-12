

import { NextApiHandler } from "next"
import { getNestedLemma } from "../../../../lib/nested/lemma"
import { getNestedSynset } from "../../../../lib/nested/synset"

const getNestedResource = (type: string, key: string) => {
  switch (type) {
    case "lemma": {
      return getNestedLemma(key)
    }
    case "synset": {
      return getNestedSynset(key)
    }
  }
  throw new Error(`Invalid param ${type}`)

}

const handler: NextApiHandler = async (req, res) => {
  const { type, key } = req.query
  const r = getNestedResource(type.toString(), key.toString())
  res.json(r)
}

export default handler