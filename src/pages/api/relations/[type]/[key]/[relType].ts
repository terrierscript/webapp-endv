import { NextApiHandler } from "next"
import { getSenseRelationExpand, getSynsetRelationExpand } from "../../../../../lib/nested/expandRelation"

const getNestedResource = (type: string, key: string, relType: string) => {
  switch (type) {
    case "synset": {
      return getSynsetRelationExpand(key, relType)
    }
    case "sense": {
      return getSenseRelationExpand(key, relType)
    }
  }
  throw new Error(`Invalid param ${type}`)

}

const handler: NextApiHandler = async (req, res) => {
  const { type, key, relType } = req.query
  const r = getNestedResource(type.toString(), key.toString(), relType.toString())
  res.json(r)
}

export default handler