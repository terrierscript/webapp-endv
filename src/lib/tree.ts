import { searchData, searchIndex } from "./dics"

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

  const { offsets, lemma } = index
  return {
    lemma,
    offsetData: offsets.map(offset => {
      const data = searchData(offset)
      return depthOffset(data)
    })
  }
}

export const generateTree = (word: string) => {
  const x = searchIndex(word)
  const tree = generateTreeFromWordIndex(x)
  return tree
}
