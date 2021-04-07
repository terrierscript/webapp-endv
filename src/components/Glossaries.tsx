import { Text, Box, ListItem, UnorderedList } from "@chakra-ui/react"
import React from "react"

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
        return <ListItem key={i}>{txt}</ListItem>
      })}
    </UnorderedList>}
  </>
}
