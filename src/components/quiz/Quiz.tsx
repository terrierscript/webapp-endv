import { Stack, Heading, Button, Center, SimpleGrid, Box } from "@chakra-ui/react"
import React, { FC, useEffect, useMemo, useState } from "react"
import { Loading } from "../Loading"
import { QuizSet } from "../../lib/quiz/QuizSet"
import { shuffle } from "../../lib/quiz/shuffle"
import { useRouter } from "next/router"
import { AnswerTabs } from "./Answer"
import { useQuiz } from "./useQuiz"

const QuizBox: FC<{ quiz: QuizSet, onNext: Function }> = ({ quiz, onNext }) => {
  const choose = useMemo(() => {
    return shuffle([quiz.collect, ...quiz.incollects])
  }, [JSON.stringify(quiz)])
  const [select, setSelect] = useState<string>()

  const [answer, setAnswer] = useState<string>()
  return <Stack boxShadow="base" p={4}>
    <Stack alignItems="center">
      <Heading size="lg">{quiz.word}</Heading>
      <SimpleGrid columns={2} w="100%" gap={2}>
        {choose.map(w => {
          const openColor = (w === quiz.collect) ? "green" : "red"
          const color = !!answer ? openColor : "blue"
          const selected = answer === w
          const opacity = answer && !selected ? 0.7 : 1
          return <Button
            outline={"solid"}
            whiteSpace={"normal"}
            opacity={opacity}
            w="100%" size="lg" fontSize="lg"
            key={w} colorScheme={color}
            onClick={() => {
              setSelect(w)
              if (!answer) {
                setAnswer(w)
              }
            }}>
            {w}
          </Button>
        })}
      </SimpleGrid>
    </Stack>
    {answer && <>
      <Button onClick={() => { onNext() }} w="100%" colorScheme="teal">Next Round</Button>
      <AnswerTabs key={quiz.word} words={[quiz.word, ...choose]} />
    </>
    }
  </Stack>
}

const QuizRound: FC<{ quizSets: QuizSet[], onNext: Function }> = ({ quizSets, onNext }) => {
  return <Center>
    <Stack width={"md"}>
      {quizSets.map(q => {
        return <QuizBox key={q.word} quiz={q} onNext={onNext} />
      })}
    </Stack>
  </Center>

}
export const Quiz: FC<{ word: string }> = ({ word }) => {
  const { quizSet: currentQuizSet, next, currentSeed, done } = useQuiz(word)
  const router = useRouter()
  useEffect(() => {
    if (!currentSeed) {
      return
    }
    router.push(`/quiz/${currentSeed}`)
  }, [currentSeed])

  if (!currentSeed || !currentQuizSet) {
    return <Loading>Generate QuizSet</Loading>
  }
  if (done) {
    return <Box>Finished</Box>
  }
  return (
    <Stack>
      <Heading>Quiz</Heading>
      <QuizRound key={currentQuizSet.word} quizSets={[currentQuizSet]} onNext={() => next()} />

    </Stack>
  )
}
