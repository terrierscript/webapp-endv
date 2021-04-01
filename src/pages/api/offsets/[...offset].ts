import { NextApiHandler } from "next"
import { getDictionary } from "../../../lib/wordnet"

const handler: NextApiHandler = async (req, res) => {
  const dic = await getDictionary()
  const { offset } = req.query
  console.log(offset)
  const offsetNums = [offset].flat().map(o => parseInt(o))
  const r = dic.searchOffsetsInDataFor(offsetNums)
  const rObj = Object.fromEntries(r.entries())
  res.json(rObj)
}
export default handler