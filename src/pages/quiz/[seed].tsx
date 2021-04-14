import { Stack, Heading, Wrap, Box, HStack, Button, Center } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import React, { FC, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { InspectWordLink } from "../../components/inspect/Link"
import { Loading } from "../../components/Loading"
import { generateQuizzes, QuizSet } from "../../lib/quiz/quiz"

const QuizBox: FC<{ quiz: QuizSet }> = ({ quiz }) => {
  const words = useMemo(() => {
    return Math.random() < 0.5
      ? [quiz.incollect, quiz.collect]
      : [quiz.collect, quiz.incollect]
  }, [JSON.stringify(quiz)])
  const [answer, setAnswer] = useState<string>()
  return <Stack boxShadow="base" p={10}>
    <Heading size="md">{quiz.word}</Heading>
    <HStack>
      {words.map(w => {
        const openColor = w === quiz.collect ? "green" : "red"
        const color = !answer ? "blue" : openColor

        return <Button size="lg" fontSize="lg" key={w} colorScheme={color}
          onClick={() => setAnswer(w)}>{w}</Button>
      })}
    </HStack>
  </Stack>
}

const QuizRound: FC<{ quizSets: QuizSet[] }> = ({ quizSets }) => {
  return <Center>
    <Stack width={"md"}>
      {quizSets.map(q => {
        return <QuizBox key={q.word} quiz={q} />
      })}
    </Stack>
  </Center>

}

export default function QuizPage({ word }: { word: string }) {
  const [currentQuizSet, setCurrentQuizSet] = useState<QuizSet[]>()
  const [currentWord, setCurentWord] = useState<string>(word)
  const { data } = useSWR(() => `/api/quiz/question/${currentWord}`)
  useEffect(() => {
    setCurrentQuizSet(data)
  }, [data])
  const executeNextRound = () => {
    if (currentQuizSet?.[0].word) {
      setCurentWord(currentQuizSet?.[0].word)
    }
  }
  return (
    <Stack>
      <Heading>Quiz</Heading>
      {currentQuizSet ? <QuizRound quizSets={currentQuizSet} /> : <Loading>Generate QuizSet</Loading>}
      <Button onClick={executeNextRound}>Next Round
      </Button>
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const seed: string = req.query.seed?.toString() ?? ""

  return {
    props: { word: seed }
  }
}