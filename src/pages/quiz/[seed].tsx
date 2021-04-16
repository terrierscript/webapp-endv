import { Stack, Text, Heading, Box, HStack, Button, Center, SimpleGrid, Tabs, TabList, Tab, TabPanel, TabPanels, Wrap, Divider } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import React, { FC, useEffect, useMemo, useState, VFC } from "react"
import useSWR from "swr"
import { fetcher } from "../../components/inspect/lemma/fetcher"
import { InspectWordLink, QuizLink } from "../../components/Link"
import { Loading } from "../../components/Loading"
import { QuizSet } from "../../lib/quiz/QuizSet"
import { WordPopover } from "../../components/WordPopover"
import { shuffle } from "../../lib/quiz/shuffle"
import { CompactDefinition } from "../../components/inspect/lemma/CompactDefinition"
import { filterFuzzyUnmatch } from "../../lib/quiz/filterFuzzyUnmatch"
import { useRouter } from "next/router"

const Answer: FC<{ word: string }> = ({ word }) => {
  return <WordPopover word={word}>
    <Text cursor={"pointer"}>{word}</Text>
  </WordPopover>
}
const AnswerTabs: FC<{ words: string[] }> = ({ words }) => {
  return <Tabs variant="soft-rounded"
  >
    <TabList >
      <Wrap>

        {words.map(w => <Tab key={w}>{w}</Tab>)}
      </Wrap>
    </TabList>
    <Divider p={2} />
    <TabPanels>
      {words.map(w => <TabPanel key={w}>
        <InspectWordLink word={w} />
        <CompactDefinition word={w} />
      </TabPanel>)}
    </TabPanels>
  </Tabs>
}

type RoundResult = {
  quizSet?: QuizSet,
  nextCandidates?: string[]

}
type Result = {
  word: string,
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


const useQuiz = (seed: string) => {
  const [stacks, setStacks] = useState<string[]>([])
  const [currentSeed, setCurrentSeed] = useState<string>(seed)
  const round = useQuizRound(currentSeed)
  const roundResult = round.roundResult
  const addStacks = (words: string[]) => {
    setStacks(s => shuffle([...new Set([...s, ...words])]).slice(0, 50))
  }
  const popStack = () => {
    const [next, ...rest] = stacks
    console.log(next, rest)
    setCurrentSeed(next)
    setStacks(rest)
  }

  useEffect(() => {
    if (round?.error) {
      console.log(round?.word, "ERROR")
      popStack()
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
    next: () => { popStack() }
  }
}

const QuizBox: FC<{ quiz: QuizSet }> = ({ quiz }) => {
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
            opacity={opacity}
            // wordBreak={"breakAll"}
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
    {answer &&
      <AnswerTabs key={quiz.word} words={[quiz.word, ...choose]} />
    }
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
  const { quizSet: currentQuizSet, next, currentSeed } = useQuiz(word)
  const router = useRouter()
  useEffect(() => {
    router.push(`/quiz/${currentSeed}`)
  }, [currentSeed])
  if (!currentQuizSet) {
    return <Loading>Generate QuizSet</Loading>
  }
  return (
    <Stack>
      <Heading>Quiz</Heading>
      <Text>{currentSeed}</Text>
      <Button onClick={() => {
        next()
      }} w="100%" colorScheme="teal">Next Round</Button>
      {currentQuizSet ? <QuizRound quizSets={[currentQuizSet]} /> : <Loading>Generate QuizSet</Loading>}

      {/* <Button onClick={executeNextRound}>

        Next Round
      </Button> */}
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const seed: string = req.query.seed?.toString() ?? ""

  return {
    props: { word: seed }
  }
}