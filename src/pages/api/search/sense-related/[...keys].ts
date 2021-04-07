
import { NextApiHandler } from "next"
import { searchRelatedSenses } from "../../../../lib/expand"
import { searchSenses } from "../../../../lib/searchSenses"

const handler: NextApiHandler = async (req, res) => {
  const { keys } = req.query
  const _keys = [keys].flat()
  const x = searchRelatedSenses(_keys)
  res.json(x)
}

export default handler