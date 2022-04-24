import React from 'react'
// @ts-ignore
import { Heading, Stack, Wrap } from '@chakra-ui/react'



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
