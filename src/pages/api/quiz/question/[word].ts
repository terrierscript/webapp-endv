import { NextApiHandler } from "next"
import { getNestedLemma } from "../../../../lib/nested/lemma"

const relatedWord = (word: string) => {
  const rel = getNestedLemma(word)
  // rel.senses.map(s => {
  //   s.
  // })
  // console.log(word)
  return rel
}
const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  const r = relatedWord(word.toString())
  res.json(r)
}

export default handler

