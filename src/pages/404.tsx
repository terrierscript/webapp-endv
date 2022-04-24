import React from 'react'
// @ts-ignore
import dictionary from "@terrierscript/wordnet-dictionary"
import { Box, Heading, HStack, Stack, Wrap } from '@chakra-ui/react'
import NextLink from "next/link"
import nlp from "compromise"
import { InspectWordLink } from '../components/Link'

// @ts-ignore
export default function Home({ randoms }) {
  return (
    <Stack>
      <Heading>404 Not found</Heading>
      <Wrap>
        <a href="/">Home</a>
      </Wrap>
    </Stack>
  )
}
