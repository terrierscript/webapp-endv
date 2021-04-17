import { useCallback, useEffect, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../inspect/lemma/fetcher"
import { QuizSet } from "../../lib/quiz/QuizSet"
import { shuffle } from "../../lib/quiz/shuffle"
import { filterFuzzyUnmatch, filterFuzzyUnmatchGenerator, filterFuzzyUnmatchNum } from "../../lib/quiz/filterFuzzyUnmatch"
import { arrayIntersect } from "../../lib/quiz/arrayIntersect"

type RoundResult = {
  quizSet?: QuizSet | null
  nextCandidates?: string[]

}
type Result = {
  word: string
  roundResult: RoundResult | null
  error: boolean
}

const generateRound = async (word: string, chooses: number): Promise<RoundResult> => {
  const data = await fetch(`/api/quiz/chooses/${word}`).then(res => res.json())
  const filterdCollect = filterFuzzyUnmatchNum(word, data.collects, 1)
  const incollects = filterFuzzyUnmatchNum(word, data.incollects, chooses - 1)
  const answer = filterdCollect[0]
  const rest = arrayIntersect(
    [...data.collects, ...data.incollects],
    new Set([...filterdCollect, ...incollects])
  )
  if (!answer || incollects.length !== chooses - 1) {
    return {
      quizSet: null,
      nextCandidates: rest
    }
  }
  return {
    quizSet: {
      word: word,
      collect: filterdCollect[0],
      incollects: incollects
    },
    nextCandidates: rest
  }
}

type ResultCache = { [key in string]: QuizSet | null }
const useCachedQuizRound = (chooseNum: number) => {
  const [results, setResults] = useState<ResultCache>({})
  const [stacks, setStacks] = useState<string[]>([])
  const addStacks = (words: string[]) => {
    setStacks(s => shuffle([...new Set([...s, ...words])]).slice(0, 50))
  }
  const removeStack = (word: string) => {
    setStacks(s => s.filter(w => w !== word))
  }

  const search = (word: string) => {
    if (results[word]) {
      console.log("::::cache hit", word,)
      return
    }
    generateRound(word, chooseNum).then(round => {
      const { quizSet, nextCandidates } = round
      setResults(r => ({ ...r, [word]: quizSet ?? null }))
      addStacks(nextCandidates ?? [])
    }).catch(e => {
      setResults(r => ({ ...r, [word]: null }))
    })
  }
  return {
    search,
    results,
    stacks,
    removeStack
  }
}

export const useQuiz = (initialWord: string) => {
  const { search, results, stacks, removeStack } = useCachedQuizRound(4)
  const [preloads, setPreloads] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string>(initialWord)
  const [currentRound, setCurrentRound] = useState<QuizSet>()
  const [done, setDone] = useState<boolean>(false)
  useEffect(() => {

    const preloadNUm = 10
    if (stacks.length === 0) {
      return
    }
    if (preloads.length > 3) {
      return
    }
    setPreloads(p => [...p, ...stacks.slice(0, preloadNUm)].slice(0, preloadNUm))
  }, [stacks])

  const next = () => {
    const [next, ...rest] = preloads
    console.log("NEXT:", next)
    console.time(next)
    setCurrentRound(undefined)
    setCurrentWord(next)
    removeStack(next)
    setPreloads(rest)
  }
  useEffect(() => {
    preloads.map(w => {
      search(w)
    })
  }, [preloads])
  useEffect(() => {
    if (!currentWord && stacks.length === 0) {
      setDone(true)
      return
    }
    search(currentWord)

  }, [currentWord])
  useEffect(() => {
    const r = results[currentWord]
    if (r === undefined) {
      return
    }
    if (r === null) {
      console.log(currentWord, " -> NULL", stacks)
      next()
      return
    }

    setCurrentRound(r)
    console.timeEnd(currentWord)

  }, [results[currentWord]])

  return {
    currentSeed: currentWord,
    quizSet: currentRound,
    done,
    next
  }
}