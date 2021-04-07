// @ts-nocheck
export const noop = () => {}
// import { searchSynset, searchLemma } from "./dics"

// const MAX_DEPTH = 20
// const generateTreeFromWordIndex = (index) => {
//   let cache = {}
//   const depthOffset = (data, depthCnt = 0) => {
//     const { offset, words, pointers } = data
//     const joinnedWord = words.join(",")
//     if (cache[offset]) {
//       return { words: joinnedWord, cycle:true }
//     }
//     cache[offset] = true
//     if (depthCnt > MAX_DEPTH) {
//       return { words: joinnedWord }
//     }
//     const ptr = [pointers[0]]
//     return {
//       words: joinnedWord,
//       children: ptr.map(ptr => {
//         const offsetData = searchSynset(ptr.offset)
//         const nestedOffsetData = depthOffset(offsetData, depthCnt + 1)
//         return nestedOffsetData
          
//       })
//     }
//   }

//   const { offsets, lemma } = index
//   return {
//     lemma,
//     offsetData: offsets.map(offset => {
//       const data = searchSynset(offset)
//       return depthOffset(data)
//     })
//   }
// }

// export const generateTree = (word: string) => {
//   const x = searchLemma(word)
//   if (!x) {
//     return {}
//   }
//   const tree = generateTreeFromWordIndex(x)
//   return tree
// }
