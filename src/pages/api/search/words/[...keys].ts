
import { NextApiHandler } from "next"
import { searchSynset,  searchWords } from "../../../../lib/dics"


const handler: NextApiHandler = async (req, res) => {
  const {  keys } = req.query
  const _keys = [keys].flat()
  const x = searchWords(_keys)
  res.json(x)
}

export default handler