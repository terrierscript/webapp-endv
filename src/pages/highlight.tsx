import React, { useState } from 'react'
import nlp from "compromise"
import { Button, Container, HStack, Input, Stack, Text, Tooltip } from '@chakra-ui/react'
import NextLink from "next/link"

const tagColor = (term: any) => {
  const { tags } = term
  if (tags.includes("Noun")) return "red.500"
  if (tags.includes("Verb")) return "blue.500"
  if (tags.includes("Adverb")) return "blue.600"
  if (tags.includes("Adjective")) return "green.500"
}

const highlightText = (text: string) => {
  return nlp(text)
    .json()
    .map((w: any) => w.terms)
    .flat()
    .map((term: any) => {
      return {
        term,
        color: tagColor(term)
      }
    })
}

const HighlightText = ({ text }: { text: string }) => {
  const highlightTerms = highlightText(text)
  return highlightTerms.map(({ term, color }: any, i: number) => {
    const { pre, post, text } = term
    return <Text as="span" key={i} >
      {pre}
      <Tooltip label={term.tags.join(",")} >
        <NextLink key={text} href={`/inspect/${text}`} passHref >
          <Text cursor="pointer"
            _hover={{ background: "yellow.100" }}
            as="span" color={color}>{text}</Text>
        </NextLink>
      </Tooltip>
      {post}
    </Text>
  })
}

const App = () => {
  const [text, setText] = useState("")
  return <Container maxW="xl" p={10}>
    <Stack>
      <HStack>
        <Input
          placeholder="Input sentence here"
          onChange={e => setText(e?.target?.value)}
          value={text} />
        <Button onClick={() => setText("")}>Clear</Button>
      </HStack>
      <Text>
        <HighlightText text={text} />
      </Text>
    </Stack>
  </Container>
}

export default function Home() {
  return <App />
}
