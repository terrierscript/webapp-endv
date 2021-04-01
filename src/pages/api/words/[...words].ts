import { NextApiHandler } from "next"
import { getDictionary } from "../../../lib/wordnet"

const searchForWords = async (words: string[] | string) => {
  const dic = await getDictionary()
  const _words = [words].flat()
  const r = dic.searchFor(_words)
  return Object.fromEntries(Array.from(r.entries()).map(([key, value]) => {
    const { offsetCount, pointerCount,...rest} = value
    return [key, rest]
  }))
}

const handler : NextApiHandler =  async (req, res) => {
  const { words } = req.query
  const result = await searchForWords(words)
  res.json(result)
}
export default handler