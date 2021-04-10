import React from 'react'
// @ts-ignore
import dictionary from "@terrierscript/wordnet-dictionary"
import { Box, Heading, Stack } from '@chakra-ui/react'
import NextLink from "next/link"
import nlp from "compromise"
import { InspectWordLink } from '../components/inspect/Link'

const getRandomWord = () => {
  // @ts-ignore
  const words = Object.keys(nlp().world?.words)
  const rand = Math.floor(Math.random() * words.length)
  return words[rand]
}

export const getServerSideProps = () => {
  const randoms = Array.from(Array(10), () => getRandomWord())
  return {
    props: { randoms }
  }
}

// @ts-ignore
export default function Home({ randoms }) {
  return (
    <Stack>
      <Heading>Random pickup</Heading>
      {randoms.map((r: string) => {
        return <Box key={r}>
          <InspectWordLink word={r} />
        </Box>
      })}
    </Stack>
  )
}
