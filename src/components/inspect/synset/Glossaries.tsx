import { Text, Box, Wrap, TextProps, HStack } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
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

const HighlightTerm: FC<any> = ({ targets, text, pre, post }) => {
  const [isHighlight, setIsHighlight] = useState(false)
  useEffect(() => {
    // @ts-ignore
    const isHighlightWord = (nlp(targets).match(text, { fuzzy: 0.7 }).length > 0)
    setIsHighlight(isHighlightWord)
  }, [])
  const textProps: TextProps = isHighlight ? {
    fontWeight: "bold",
    textDecoration: "underline dashed"
  } : {}

  return <Text as="span">
    <Text as="span">{pre}</Text>
    <Text as="span"{...textProps}>{text}</Text>
    <Text as="span">{post}</Text>
  </Text>
}

const HighlightExample: FC<{ sentence: string, words: string[] }> = ({ sentence, words }) => {
  const [terms, setTerms] = useState<any[]>()
  const targetText = words.join(" ")
  useEffect(() => {
    const terms = nlp(sentence).terms().json().map((t: any) => t.terms).flat()
    setTerms(terms)
  }, [])
  if (!terms) {
    return <>{sentence}</>
  }
  return <>{terms.map((term: any, i: number) => {
    return <HighlightTerm key={i} {...term} targets={targetText} />
    // // @ts-ignore
    // const isHighlightWord = nlp(words.join(" ")).match(text, { fuzzy: 0.7 }).length > 0
    // const textProps: TextProps = isHighlightWord ? {
    //   fontWeight: "bold",
    //   textDecoration: "underline dashed"
    // } : {}

    // return <Text key={i} as="span">
    //   <Text as="span">{pre}</Text>
    //   <Text as="span"{...textProps}>{text}</Text>
    //   <Text as="span">{post}</Text>
    // </Text>
  })}</>
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
