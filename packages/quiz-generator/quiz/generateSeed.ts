import { relatedWord } from "./relatedWord"
import { kinderWords } from "./kind"
import { arrayIntersect } from "../util/arrayIntersect"
import { shuffle } from "../util/shuffle"
import { filterFuzzyUnmatch } from "./filterFuzzyUnmatch"
import { isQuizWord } from "./isQuizWord"
import dictionary from "../dictionary/dictionary"

type QuizSeed = {
  word: string,
  collects: string[],
  incollects: string[]
}

export const generateQuizSeed = (word: string): QuizSeed => {
  const [w, level1, level2] = relatedWord(word.toString())
  const d1 = kinderWords(level2)
  // shuffle(level2).slice(0, 5))
  const collects = level1
  const incollectCandidate = new Set([...level1, ...level2, ...w])
  const incollects = arrayIntersect(d1.children, incollectCandidate)
  return {
    word,
    collects,
    incollects,
    // debug: { l1, l2 }
  }
}

export const seedToQuiz = (seed: QuizSeed) => {
  const r = filterFuzzyUnmatch(seed.word, seed.collects)
  // console.log(seed)
  // if (r.le1) {
  //   return null
  // }
  const quiz = {
    word: seed.word,
    collect: shuffle(r)[0],
    incollects: shuffle(seed.incollects).slice(0, 3)
  }

  if (!quiz.collect || quiz.incollects.length < 3) {
    return null
  }
  return quiz
}

const generateRandom = () => {
  const word = dictionary.getRandomWord()
  if (!isQuizWord(word)) {
    return
  }
  if (word.split(" ").length > 1) {
    return
  }
  return word
}

export const generateRandomQuiz = () => {
  for (let i = 0;i < 100;i++) {
    const word = generateRandom()
    if (!word) {
      continue
    }
    const seed = generateQuizSeed(word)
    const quiz = seedToQuiz(seed)
    if (quiz) {
      return quiz
    }
  }
}