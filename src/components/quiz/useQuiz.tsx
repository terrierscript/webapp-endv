import { useEffect, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../inspect/lemma/fetcher"
import { QuizSet } from "../../lib/quiz/QuizSet"
import { shuffle } from "../../lib/quiz/shuffle"
import { filterFuzzyUnmatch } from "../../lib/quiz/filterFuzzyUnmatch"

type RoundResult = {
  quizSet?: QuizSet
  nextCandidates?: string[]

}
type Result = {
  word: string
  roundResult: RoundResult | null
  error: boolean
}
const useQuizRound = (word: string): Result => {
  const [quizSet, setCurrentQuizSet] = useState<RoundResult>()
  const [isError, setIsError] = useState<boolean>(false)
  const { data, error } = useSWR(() => word ? `/api/quiz/chooses/${word}` : null, fetcher, {
    refreshWhenHidden: false,
    refreshInterval: 0,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  useEffect(() => {
    setIsError(false)
    setCurrentQuizSet(undefined)
  }, [word])
  useEffect(() => {
    if (!word || !data) {
      return
    }
    if (error) {
      setIsError(true)
      return
    }
    const filterdCollect = shuffle(filterFuzzyUnmatch(word, data.collects))
    const filterdIncollect = shuffle(filterFuzzyUnmatch(word, data.incollects))
    const [answer, ...restCollect] = filterdCollect
    const chooses = 4
    const incollects = filterdIncollect.splice(0, chooses - 1)
    const rest = shuffle([...restCollect, ...filterdIncollect])
    const errorQuiz = !answer || incollects.length !== chooses - 1
    if (errorQuiz) {
      setIsError(true)
      return
    }
    setCurrentQuizSet({
      quizSet: {
        word: word,
        collect: answer,
        incollects: incollects
      },
      nextCandidates: rest
    })
  }, [data])

  return {
    word,
    roundResult: quizSet ?? null,
    error: isError
  }
}
export const useQuiz = (seed: string) => {
  const [stacks, setStacks] = useState<string[]>([])
  const [currentSeed, setCurrentSeed] = useState<string>(seed)
  const round = useQuizRound(currentSeed)
  const roundResult = round.roundResult
  const addStacks = (words: string[]) => {
    setStacks(s => shuffle([...new Set([...s, ...words])]).slice(0, 50))
  }
  const createNextRound = () => {
    const [next, ...rest] = stacks
    setCurrentSeed(next)
    setStacks(rest)

  }

  useEffect(() => {
    if (round?.error) {
      console.log(round?.word, "ERROR")
      createNextRound()
    }
  }, [JSON.stringify(round)])

  useEffect(() => {
    if (roundResult?.nextCandidates) {
      addStacks(roundResult?.nextCandidates)
    }
  }, [roundResult?.nextCandidates?.join("/")])

  return {
    currentSeed,
    quizSet: roundResult?.quizSet,
    next: () => { createNextRound() }
  }
}
