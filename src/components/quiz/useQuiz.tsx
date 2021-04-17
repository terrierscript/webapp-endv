import { useCallback, useDebugValue, useEffect, useState } from "react"
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
  const [loaded, setLoaded] = useState<any>({})
  const [stacks, setStacks] = useState<string[]>([])
  const addStacks = (words: string[]) => {
    setStacks(s => shuffle([...new Set([...s, ...words])]).slice(0, 50))
  }
  const removeFromStack = (word: string) => {
    setStacks(s => s.filter(w => w !== word))
  }

  const search = (word: string) => {
    if (results[word]) {
      console.log("::::cache hit", word)
      return
    }
    if (loaded[word]) {
      return
    }
    setLoaded((r: any) => ({ ...r, [word]: true }))
    console.log("::::cache nothit", word)
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
    removeFromStack
  }
}

export const useQuiz = (initialWord: string) => {
  const { search, results, stacks, removeFromStack } = useCachedQuizRound(4)
  const [preloads, setPreloads] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string>()
  const [currentRound, setCurrentRound] = useState<QuizSet>()
  const [done, setDone] = useState<boolean>(false)

  const preloadNum = 10
  // console.log(results, stacks, preloads, currentWord, currentRound)
  const setPre = (preloads: string[]) => {
    setPreloads(preloads)
    preloads.map(w => {
      search(w)
    })
  }
  // stack -> preload
  useEffect(() => {
    if (stacks.length === 0) { return }
    if (preloads.length > 3) { return }
    setPre([...preloads, ...stacks.slice(0, preloadNum)].slice(0, preloadNum))
  }, [preloads.join("/"), stacks.join("/")])

  const setCurrent = (next: string) => {
    setCurrentWord(next)
    search(next)
    removeFromStack(next)
  }
  useEffect(() => {
    setCurrent(initialWord)
  }, [initialWord])

  const next = () => {
    const [next, ...rest] = preloads
    if (!next && stacks.length === 0) {
      setDone(true)
      return
    }
    console.time(next)
    // reset
    setCurrentRound(undefined)
    // set current
    setCurrent(next)

    // preload
    setPre(rest)
  }
  useEffect(() => {
    preloads.map(w => {
      search(w)
    })
  }, [preloads.join("/")])

  useEffect(() => {
    if (currentWord || preloads.length === 0) {
      return
    }
    next()
  }, [preloads, currentWord])
  useEffect(() => {
    if (!currentWord) {
      return
    }
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
  }, [currentWord, results])

  return {
    currentSeed: currentWord,
    quizSet: currentRound,
    done,
    next
  }
}