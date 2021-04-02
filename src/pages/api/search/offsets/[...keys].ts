
import { NextApiHandler } from "next"
import { searchIndex, searchData } from "@terrierscript/wordnet-dictionary"
const handler : NextApiHandler =  async (req, res) => {
  const {  keys } = req.query
  const _keys = [keys].flat()
  const x = Object.fromEntries(_keys.map(w => {
    const r =  searchData(w)
    return [w, r]
  }))
  res.json(x)
}

export default handler