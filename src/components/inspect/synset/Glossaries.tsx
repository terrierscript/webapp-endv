import { Text, Box, Wrap, TextProps, HStack } from "@chakra-ui/react"
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react"
import nlp from "compromise"
import { Lemma } from "../lemma/Lemma"
import { SearchableText } from "./Term"
import { wordForms } from "../../../lib/dictionary/wordForms"

export type HighlightProps = {
  isHighlight: boolean
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

type DefinitionProps = Pick<GlossaryProps, "definition"> & HighlightProps

const Definitions: FC<DefinitionProps> = ({ definition, isHighlight }) => {
  return <Wrap align="center">
    {definition.map(def => <Box key={def}>
      <SearchableText isHighlight={isHighlight} as="b">{def}</SearchableText>
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
    // fontWeight: "bold",
    color: "red.700",
    textDecoration: "underline dashed"
  } : {}

  return <Text as="span">
    <Text as="span">{pre}</Text>
    <Text as="span"{...textProps}>{text}</Text>
    <Text as="span">{post}</Text>
  </Text>
}

const Hover: FC<{ inactive: ReactNode, active: ReactNode }> = ({ inactive, active }) => {
  const [isActive, setActive] = useState(false)
  return <Box onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
    {isActive ? <>{active}</> : <>{inactive}</>}
  </Box>
}

type HighlightExampleProps = { sentence: string, words: string[] } & HighlightProps
const HighlightExample: FC<HighlightExampleProps> = ({ sentence, words, isHighlight }) => {
  const [terms, setTerms] = useState<any[]>()
  const targetText = words.join(" ")
  useEffect(() => {
    const terms = nlp(sentence).terms().json().map((t: any) => t.terms).flat()
    setTerms(terms)
  }, [])
  if (!terms || !isHighlight) {
    return <>{sentence}</>
  }

  return <>{terms.map((term: any, i: number) => {
    return <HighlightTerm key={i} {...term} targets={targetText} />
  })}</>
}

type ExampleProps = Pick<GlossaryProps, "example" | "lemma"> & HighlightProps
const Examples: FC<ExampleProps> = ({ lemma, example, isHighlight }) => {
  const examples = useMemo(() => example?.map(l => typeof l === "string" ? l : l["#text"]), [example])
  return <Wrap lineHeight="1">{
    examples.map((ex, i) => [
      i > 0 && <Text key={`sep-${i}`} as="small">/</Text>,
      <Text as="small" key={ex}>
        <HighlightExample
          isHighlight={isHighlight}
          sentence={ex} words={lemma}
        />
      </Text>]
    )
  }
  </Wrap>
}

export const Glossaries = ({ lemma, definition, example }: GlossaryProps) => {
  const [isActive, setActive] = useState(false)

  return <Box p={2} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
    {definition && <Definitions isHighlight={isActive} definition={definition} />}
    {example && <Examples isHighlight={isActive} lemma={lemma} example={example} />}
  </Box>
}
