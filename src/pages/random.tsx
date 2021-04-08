import React from 'react'
// @ts-ignore
import dictionary from "@terrierscript/wordnet-dictionary"
import { Box, Stack } from '@chakra-ui/react'
import NextLink from "next/link"
import nlp from "compromise"

const getRandomWord = () => {
  // @ts-ignore
  const words = Object.keys(nlp().world?.words)
  const rand = Math.floor(Math.random() * words.length)
  return words[rand]
}

export const getServerSideProps = () => {
  // const randoms = Array.from(Array(4), () => dictionary.getRandomWord())
  const randoms = Array.from(Array(4), () => getRandomWord())
  return {
    props: { randoms }
  }
}

// @ts-ignore
export default function Home({ randoms }) {
  return (
    <Stack>

      {randoms.map((r: string) => {
        return <Box key={r}>
          <NextLink href={`/inspect/${r}`}>{r}</NextLink>
        </Box>
      })}
    </Stack>
  )
}
