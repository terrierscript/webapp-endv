import React from "react"
import { Box, Heading, HStack, Icon, Text } from "@chakra-ui/react"
import nlp from "compromise"
import compromiesSyllables from 'compromise-syllables'
// @ts-ignore
import compromisePronounce from 'compromise-pronounce'
import { AiOutlineSound } from "react-icons/ai"

nlp.extend(compromiesSyllables)
nlp.extend(compromisePronounce)
export const LemmaHeader = ({ word }: { word: string }) => {
  const n = nlp(word)
  // @ts-ignore
  const terms = n.terms().syllables()
  //.terms.syllables()
  const s = terms.map(({ syllables }: any) => syllables.join("-")).join(" ")
  // @ts-ignore
  const pron = n.pronounce().map(o => o.pronounce).join(" ")
  console.log("p", pron)
  return <Box p={4} position="sticky" top="0" bg="white">
    <HStack verticalAlign="middle">
      <Heading >
        {word}
      </Heading>
      <Text fontSize="sm" color="gray">
        {s}
      </Text>
      <Text fontSize="sm" color="gray">
        <Icon as={AiOutlineSound} />
        {pron}
      </Text>
    </HStack>
  </Box>
}
