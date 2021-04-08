import { Text, Box, ListItem, UnorderedList, Stack, HStack, Wrap } from "@chakra-ui/react"
import React from "react"
import nlp from "compromise"
import { ItemAccordion } from "../../Acordion"

const ExampleText = ({ text }: { text: string }) => {
  return <Box>{text}</Box>
}

type Example = string | {
  "dc:source": string
  "#text": string
}
export const Glossaries = ({ definition, example }: { definition: string[], example: Example[] }) => {
  const examples = example?.join(" / ")
  return <>
    {definition && <Wrap align="center">
      <Text as="b">{definition}</Text>
      {examples && <Text as="small">{examples}</Text>}
    </Wrap>
    }
    {/* {example &&
      <ItemAccordion title="Examples">
        <UnorderedList fontSize="xs">
          {example.map((gl, i) => {
            const txt = typeof gl === "string" ? gl : gl["#text"]
            return <ListItem key={i}>
              <ExampleText text={txt} />
            </ListItem>
          })}
        </UnorderedList>
      </ItemAccordion>
    } */}
  </>
}
