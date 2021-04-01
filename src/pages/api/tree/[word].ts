
import { NextApiHandler } from "next"
import { searchData, searchIndex } from "../../../lib/dics"

const generateTreeFromWordIndex = (index) => {

  const depthOffset = (data, depthCnt = 0) => {
    const { words, pointers } = data
    if (depthCnt > 4) {
      return { words }
    }
    return {
      words,
      pointersData: pointers.map(ptr => {
        const offsetData = searchData(ptr.offset)
        const nestedOffsetData = depthOffset(offsetData, depthCnt + 1)
        return {
          offsetData: nestedOffsetData,
          // pos: ptr.pos
        }
      })
    }
  }

  const {offsets, lemma} = index
  return {
    lemma,
    offsetData: offsets.map(offset => {
      const data = searchData(offset)
      return depthOffset(data)
    })
  }
}
const generateTree = (word: string) => {
  const x = searchIndex(word)
  const tree = generateTreeFromWordIndex(x)
  return tree
}
const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  if (typeof word !== "string") {
    res.status(400).end()
    return 
  }
  const tree = generateTree(word)
  res.json(tree)
}

export default handler