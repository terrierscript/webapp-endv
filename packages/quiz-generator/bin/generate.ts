import { isNotNull } from "typesafe-utils"
import dictionary from "../dictionary/dictionary"
import { generateQuizSeed } from "../quiz/generateSeed"
import { isQuizWord } from "../quiz/isQuizWord"

const generateIdx = (idx: string) => {
  const words = dictionary.getFileWords(idx)
  return words.map(word => {
    if (!isQuizWord(word)) {
      return null
    }
    const result = generateQuizSeed(word)
    return [word, result]
  }).filter(isNotNull)
}

const execute = () => {
  const idxs = dictionary.getFileIndexes()
  idxs.map(idx => {
    const r = generateIdx(idx)
    console.log(r, idx)
  })
}

execute()