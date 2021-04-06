import { Text, Box, ListItem, UnorderedList } from "@chakra-ui/react"
import React from "react"

export const Glossaries = ({ definition, example }) => {
  return <>
    {definition && <Box>
      <Text as="i">{definition}</Text>
    </Box>}
    {example && <UnorderedList fontSize="xs">
      {example.map(gl => {
        return <ListItem key={gl}>{gl}</ListItem>
      })}
    </UnorderedList>}
  </>
}
