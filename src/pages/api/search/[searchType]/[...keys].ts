
import { NextApiHandler } from "next"
import { searchData, searchIndex } from "../../../../lib/dics"

const handler : NextApiHandler =  async (req, res) => {
  const { searchType, keys } = req.query
  if (searchType !== "words" && searchType !== "offsets") {
    res.status(400).end()
    return 
  }
  const _keys = [keys].flat()
  const x = Object.fromEntries(_keys.map(w => {
    const r = searchType === "words" ? searchIndex(w) : searchData(w)
    console.log(r)
    return [w, r]
  }))
  res.json(x)
}

export default handler