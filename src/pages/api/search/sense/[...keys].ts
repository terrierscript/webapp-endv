
import { NextApiHandler } from "next"
import { searchSynset, searchLemma, searchExpandSense } from "../../../../lib/dics"

const handler: NextApiHandler = async (req, res) => {
  const { keys } = req.query
  const _keys = [keys].flat()
  const x = Object.fromEntries(_keys.map(w => {
    const r = searchExpandSense(w)
    return [w, r]
  }))
  res.json(x)
}

export default handler