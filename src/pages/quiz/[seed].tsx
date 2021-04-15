import { Stack, Text, Heading, Box, HStack, Button, Center, SimpleGrid, Tabs, TabList, Tab, TabPanel, TabPanels, Wrap, Divider } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import React, { FC, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../../components/inspect/lemma/fetcher"
import { InspectWordLink, QuizLink } from "../../components/Link"
import { Loading } from "../../components/Loading"
import { QuizSet } from "../../lib/quiz/quiz"
import { WordPopover } from "../../components/WordPopover"
import { shuffle } from "../../lib/quiz/shuffle"
import { CompactDefinition } from "../../components/inspect/lemma/CompactDefinition"

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

        {words.map(w => <Tab >{w}</Tab>)}
      </Wrap>
    </TabList>
    <Divider p={2} />
    <TabPanels>
      {words.map(w => <TabPanel>
        <InspectWordLink word={w} />
        <CompactDefinition word={w} />
      </TabPanel>)}
    </TabPanels>
  </Tabs>
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
      <AnswerTabs words={[quiz.word, ...choose]} />
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
  const [currentQuizSet, setCurrentQuizSet] = useState<QuizSet[] | null>(null)

  const { data, error } = useSWR(() => `/api/quiz/question/${word}`, fetcher, {
    refreshWhenHidden: false,
    refreshInterval: 0,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  useEffect(() => {
    setCurrentQuizSet(data)
  }, [data])
  const nextWord = useMemo(() => {
    return currentQuizSet?.[0]?.word
  }, [currentQuizSet])
  if (error) {
    return <Stack>😇 Error</Stack>
  }
  return (
    <Stack>
      <Heading>Quiz</Heading>
      {currentQuizSet ? <QuizRound quizSets={currentQuizSet} /> : <Loading>Generate QuizSet</Loading>}
      {nextWord && <QuizLink word={nextWord}>
        <Button w="100%" colorScheme="teal">Next Round</Button>
      </QuizLink>}

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