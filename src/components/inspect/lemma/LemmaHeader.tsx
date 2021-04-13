import React from "react"
import { Box, Heading, HStack, Text } from "@chakra-ui/react"
import nlp from "compromise"
import compromiesSyllables from 'compromise-syllables'

nlp.extend(compromiesSyllables)
export const LemmaHeader = ({ word }: { word: string }) => {
  // @ts-ignore
  const terms = nlp(word).terms().syllables()
  //.terms.syllables()
  const s = terms.map(({ syllables }: any) => syllables.join("-")).join(" ")
  return <Box p={4} position="sticky" top="0" bg="white">
    <HStack verticalAlign="middle">
      <Heading >
        {word}
      </Heading>
      <Text fontSize="sm" color="gray">
        {s}
      </Text>
    </HStack>
  </Box>
}
