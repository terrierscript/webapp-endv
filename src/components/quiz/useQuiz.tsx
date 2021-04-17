import { useCallback, useEffect, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../inspect/lemma/fetcher"
import { QuizSet } from "../../lib/quiz/QuizSet"
import { shuffle } from "../../lib/quiz/shuffle"
import { filterFuzzyUnmatch, filterFuzzyUnmatchGenerator, filterFuzzyUnmatchNum } from "../../lib/quiz/filterFuzzyUnmatch"
import { arrayIntersect } from "../../lib/quiz/arrayIntersect"

type RoundResult = {
  quizSet?: QuizSet
  nextCandidates?: string[]

}
type Result = {
  word: string
  roundResult: RoundResult | null
  error: boolean
}

const generateRound = async (word: string, chooses: number): Promise<RoundResult | null> => {
  const data = await fetch(`/api/quiz/chooses/${word}`).then(res => res.json())
  const filterdCollect = filterFuzzyUnmatchNum(word, data.collects, 1)
  const incollects = filterFuzzyUnmatchNum(word, data.incollects, chooses - 1)
  const answer = filterdCollect[0]
  const rest = arrayIntersect(
    [...data.collects, ...data.incollects],
    new Set([...filterdCollect, ...incollects])
  )
  if (!answer || incollects.length !== chooses - 1) {
    return null
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

const useQuizRound = (word: string, chooses = 4): Result => {
  const [quizSet, setCurrentQuizSet] = useState<RoundResult>()
  const [isError, setIsError] = useState<boolean>(false)
  const [data, setData] = useState<RoundResult | null>()
  const [error, setError] = useState()

  useEffect(() => {
    console.time(word)
    setIsError(false)
    setCurrentQuizSet(undefined)

    generateRound(word, chooses).then(round => {
      setData(round)
    }).catch(e => setError(e))
  }, [word])

  useEffect(() => {
    if (!word) { return }
    if (error) {
      setIsError(true)
      return
    }
    if (data === null) {
      setIsError(true)
      return
    }
    setCurrentQuizSet(data)
    console.timeEnd(word)
  }, [data, error])

  return {
    word,
    roundResult: quizSet ?? null,
    error: isError
  }
}

type ResultCache = { [key in string]: RoundResult | null }
const useCachedQuizRound = (chooseNum: number) => {
  const [results, setResults] = useState<ResultCache>({})
  const search = (word: string) => {
    if (results[word]) {
      console.log("::::cache hit", word,)
      return
    }
    generateRound(word, chooseNum).then(round => {
      setResults(r => ({ ...r, [word]: round }))
    }).catch(e => {
      setResults(r => ({ ...r, [word]: null }))
    })
  }
  return {
    search,
    results
  }
}

export const useQuiz = (initialWord: string) => {
  const { search, results } = useCachedQuizRound(4)
  const [stacks, setStacks] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string>(initialWord)
  const [currentRound, setCurrentRound] = useState<QuizSet>()
  const addStacks = (words: string[]) => {
    setStacks(s => [...new Set([...s, ...words])].slice(0, 50))
  }

  const next = () => {
    const [next, ...rest] = stacks
    console.log("NEXT:", next)
    console.time(next)
    setCurrentRound(undefined)
    setCurrentWord(next)
    setStacks(rest)
  }
  useEffect(() => {
    stacks.slice(1, 10).map(w => {
      search(w)
    })
  }, [stacks[0]])
  useEffect(() => {
    search(currentWord)
  }, [currentWord])
  useEffect(() => {
    const r = results[currentWord]
    console.log(currentWord, r)
    if (r === undefined) {
      return
    }
    if (r === null) {
      console.log(currentWord, " -> NULL")
      next()
      return
    }

    setCurrentRound(r.quizSet)
    addStacks(r.nextCandidates ?? [])
    console.timeEnd(currentWord)

  }, [results[currentWord]])

  return {
    currentSeed: currentWord,
    quizSet: currentRound,
    done: stacks.length === 0,
    next
  }
}

// export const useQuiz = (initialSeed: string) => {
//   const [currentSeed, setCurrentSeed] = useState<string>(initialSeed)
//   const [stacks, setStacks] = useState<string[]>([])
//   const round = useQuizRound(currentSeed)
//   const roundResult = round.roundResult
//   const addStacks = (words: string[]) => {
//     setStacks(s => shuffle([...new Set([...s, ...words])]).slice(0, 50))
//   }
//   const createNextRound = () => {
//     const [next, ...rest] = stacks
//     setCurrentSeed(next)
//     setStacks(rest)

//   }

//   useEffect(() => {
//     if (round?.error) {
//       console.log(round?.word, "ERROR")
//       createNextRound()
//     }
//   }, [JSON.stringify(round)])

//   useEffect(() => {
//     if (roundResult?.nextCandidates) {
//       addStacks(roundResult?.nextCandidates)
//     }
//   }, [roundResult?.nextCandidates?.join("/")])

//   return {
//     currentSeed,
//     quizSet: roundResult?.quizSet,
//     next: () => { createNextRound() }
//   }
// }
