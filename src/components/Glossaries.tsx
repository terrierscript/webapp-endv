import { Text, Box, ListItem, UnorderedList } from "@chakra-ui/react"
import React from "react"
import nlp from "compromise"

const ExampleText = ({ text }: { text: string }) => {
  const a = nlp(text).json()
  console.log(a)
  console.log(a)
  return <Box>{text}</Box>
}
type Example = string | {
  "dc:source": string
  "#text": string
}
export const Glossaries = ({ definition, example }: { definition: string[], example: Example[] }) => {
  return <>
    {definition && <Box>
      <Text as="i">{definition}</Text>
    </Box>}
    {example && <UnorderedList fontSize="xs">
      {example.map((gl, i) => {
        const txt = typeof gl === "string" ? gl : gl["#text"]
        return <ListItem key={i}>
          {txt}
          <ExampleText text={txt} />
        </ListItem>
      })}
    </UnorderedList>}
  </>
}
