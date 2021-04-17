import { useEffect, useState } from "react"
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
const filterAndRetrieve = (word: string, candidate: string[], choose: number) => {

}
const useQuizRound = (word: string, chooses = 4): Result => {
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
    const filterdCollect = filterFuzzyUnmatchNum(word, data.collects, 1)
    const incollects = filterFuzzyUnmatchNum(word, data.incollects, chooses - 1)
    const answer = filterdCollect[0]
    const rest = arrayIntersect(
      [...data.collects, ...data.incollects],
      new Set([...filterdCollect, ...incollects])
    )
    if (!answer || incollects.length !== chooses - 1) {
      setIsError(true)
      return
    }
    setCurrentQuizSet({
      quizSet: {
        word: word,
        collect: filterdCollect[0],
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

export const useQuiz = (initialSeed: string) => {
  const [currentSeed, setCurrentSeed] = useState<string>(initialSeed)
  const [stacks, setStacks] = useState<string[]>([])
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
