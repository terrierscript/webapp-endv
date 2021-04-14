import React from 'react'
// @ts-ignore
import dictionary from "@terrierscript/wordnet-dictionary"
import { Box, Heading, HStack, Stack, Wrap } from '@chakra-ui/react'
import NextLink from "next/link"
import nlp from "compromise"
import { InspectWordLink } from '../components/Link'

const getRandomWord = () => {
  // @ts-ignore
  const words = Object.keys(nlp().world?.words)
  const rand = Math.floor(Math.random() * words.length)
  return words[rand]
}

export const getServerSideProps = () => {
  const randoms = [
    ...Array.from(Array(10), () => dictionary.getRandomWord()),
    ...Array.from(Array(10), () => getRandomWord()),
  ]
  return {
    props: { randoms }
  }
}


// @ts-ignore
export default function Home({ randoms }) {
  return (
    <Stack>
      <Heading>404 Not found</Heading>
      <Wrap>
        {randoms.map((r: string) => {
          return <Box key={r}>
            <InspectWordLink word={r} />
          </Box>
        })}
      </Wrap>
    </Stack>
  )
}
