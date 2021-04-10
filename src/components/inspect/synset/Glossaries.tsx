import { Text, Box, Wrap, TextProps } from "@chakra-ui/react"
import React, { FC } from "react"
import nlp from "compromise"
import { Lemma } from "../lemma/Lemma"
import { Term } from "./Term"


const SearchableText: FC<{ children: string } & TextProps> = ({ children, ...props }) => {
  const terms = nlp(children).terms().json().map((t: any) => t.terms).flat()
  return <>{terms.map((t: any, i: number) => {
    return <Term key={i} term={t} {...props} />
  })}</>
}

type Example = string | {
  "dc:source": string
  "#text": string
}

type GlossaryProps = {
  lemma: string[]
  definition: string[]
  example: Example[]
}

type DefinitionProps = Pick<GlossaryProps, "definition">

const Definitions: FC<DefinitionProps> = ({ definition }) => {
  return <Wrap align="center">
    {definition.map(def => <Box key={def}>
      <SearchableText as="b">{def}</SearchableText>
    </Box>)}
  </Wrap>

}

export const Glossaries = ({ lemma, definition, example }: GlossaryProps) => {
  const examples = example?.join(" / ")
  return <Box p={2}>
    {definition && <Definitions definition={definition} />}
    {examples && <Text as="small">{examples}</Text>}
  </Box>
}
