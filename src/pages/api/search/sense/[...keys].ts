
import { NextApiHandler } from "next"
import { searchSenses } from "../../../../lib/dics"

const handler: NextApiHandler = async (req, res) => {
  const { keys } = req.query
  const _keys = [keys].flat()
  const x = searchSenses(_keys)
  res.json(x)
}

export default handler