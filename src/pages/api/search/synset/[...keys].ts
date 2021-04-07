
import { NextApiHandler } from "next"
import { searchSynsets } from "../../../../lib/expand"

const handler: NextApiHandler = async (req, res) => {
  const {  keys } = req.query
  const _keys = [keys].flat()
  const x = searchSynsets(_keys)
  res.json(x)
}

export default handler