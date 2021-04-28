import React from 'react'
// @ts-ignore
import dictionary from "@terrierscript/wordnet-dictionary"
import { Box, Heading, HStack, Stack, Wrap } from '@chakra-ui/react'
import NextLink from "next/link"
import nlp from "compromise"
import { InspectWordLink } from '../components/Link'
import { Search } from '../components/inspect/Search'
import { GetStaticPaths, GetStaticProps } from 'next'

const getRandomWord = () => {
  // @ts-ignore
  const words = Object.keys(nlp().world?.words)
  const rand = Math.floor(Math.random() * words.length)
  return words[rand]
}

export const getStaticProps: GetStaticProps = async () => {
  const randoms = [
    ...Array.from(Array(10), () => dictionary.getRandomWord()),
    ...Array.from(Array(10), () => getRandomWord()),
  ]
  return {
    props: { randoms },
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

// @ts-ignore
export default function Home({ randoms }) {
  return (
    <Stack>
      <Search />
      <Heading>Random pickup</Heading>
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
