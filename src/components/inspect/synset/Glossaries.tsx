import { Text, Box, Wrap, TextProps, HStack } from "@chakra-ui/react"
import React, { FC } from "react"
import nlp from "compromise"
import { Lemma } from "../lemma/Lemma"
import { SearchableText } from "./Term"
import { wordForms } from "../../../lib/dictionary/wordForms"

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


const HighlightExample: FC<{ sentence: string, words: string[] }> = ({ sentence, words }) => {

  const terms = nlp(sentence).terms().json().map((t: any) => t.terms).flat()
  return terms.map(({ text, pre, post }: any, i: number) => {
    // @ts-ignore
    const isHighlightWord = nlp(words.join(" ")).match(text, { fuzzy: 0.7 }).length > 0
    // || words.includes(text)
    // || wordForms(text).some(formedText => words.includes(formedText))
    // console.log(wordForms(text))
    const textProps: TextProps = isHighlightWord ? {
      fontWeight: "bold",
      textDecoration: "underline dashed"
    } : {}

    return <Text key={i} as="span">
      <Text as="span">{pre}</Text>
      <Text as="span"{...textProps}>{text}</Text>
      <Text as="span">{post}</Text>
    </Text>
  })
}

const Examples: FC<Pick<GlossaryProps, "example" | "lemma">> = ({ lemma, example }) => {
  const examples = example?.map(l => typeof l === "string" ? l : l["#text"])
  return <Wrap lineHeight="1">{examples.map((ex, i) => [
    i > 0 && <Text key={`sep-${i}`} as="small">/</Text>,
    <Text as="small" key={ex}>
      <HighlightExample
        sentence={ex} words={lemma}
      />
    </Text>])}</Wrap>
}

export const Glossaries = ({ lemma, definition, example }: GlossaryProps) => {
  return <Box p={2}>
    {definition && <Definitions definition={definition} />}
    {example && <Examples lemma={lemma} example={example} />}
  </Box>
}
