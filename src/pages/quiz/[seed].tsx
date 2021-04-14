import { Stack, Text, Heading, Wrap, Box, HStack, Button, Center, ButtonProps } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import React, { FC, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../../components/inspect/lemma/fetcher"
import { InspectWordLink } from "../../components/Link"
import { Loading } from "../../components/Loading"
import { generateQuizzes, QuizSet } from "../../lib/quiz/quiz"
import { WordPopover } from "../../components/WordPopover"

const Answer: FC<{ word: string }> = ({ word }) => {
  return <WordPopover word={word}>
    <Text cursor={"pointer"}>{word}</Text>
  </WordPopover>
}
const QuizBox: FC<{ quiz: QuizSet }> = ({ quiz }) => {
  const choose = useMemo(() => {
    return Math.random() < 0.5
      ? [quiz.incollect, quiz.collect]
      : [quiz.collect, quiz.incollect]
  }, [JSON.stringify(quiz)])
  const [answer, setAnswer] = useState<string>()
  return <Stack boxShadow="base" p={4}>
    <Stack alignItems="center">
      <Heading size="lg">{quiz.word}</Heading>
      <HStack w="100%">
        {choose.map(w => {
          const openColor = (w === quiz.collect) ? "green" : "red"
          const color = !!answer ? openColor : "blue"
          const selected = answer === w
          const borderProps: ButtonProps = selected ? {
            borderColor: "blue.500",
            border: "2px"
          } : {}
          const opacity = answer && !selected ? 0.7 : 1
          return <Button
            outline={"solid"}
            opacity={opacity}
            // border={selected ? "4px" : 0}
            // borderColor="yellow.500"
            // {...borderProps}
            // opacity={opacity}
            w="100%" size="lg" fontSize="lg"
            key={w} colorScheme={color}
            onClick={() => !answer && setAnswer(w)}>
            {w}
          </Button>
        })}
      </HStack>
    </Stack>
    {answer && <HStack w="100%">{
      [quiz.word, ...choose].map(c => <Box w="100%" textAlign="center" key={c} >
        <Answer word={c} />
      </Box>)
    }</HStack>}
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
  const [currentQuizSet, setCurrentQuizSet] = useState<QuizSet[] | null>(null)
  const [currentWord, setCurentWord] = useState<string>(word)

  const { data } = useSWR(() => `/api/quiz/question/${currentWord}`, fetcher, {
    refreshWhenHidden: false,
    refreshInterval: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  useEffect(() => {
    setCurrentQuizSet(data)
  }, [data])
  const executeNextRound = () => {
    setCurrentQuizSet(null)
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