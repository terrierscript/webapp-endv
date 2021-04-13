import { Text, TextProps } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import nlp from "compromise"
import { HighlightProps } from "./Glossaries"

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
    <Text as="span" {...textProps}>{text}</Text>
    <Text as="span">{post}</Text>
  </Text>
}

type HighlightExampleProps = { sentence: string; words: string[] } & HighlightProps
export const HighlightExample: FC<HighlightExampleProps> = ({ sentence, words, isHighlight }) => {
  const [terms, setTerms] = useState<any[]>()
  const targetText = words.join(" ")
  useEffect(() => {
    setTimeout(() => {
      const terms = nlp(sentence).terms().json().map((t: any) => t.terms).flat()
      setTerms(terms)
    }, 1000)
  }, [])
  if (!terms || !isHighlight) {
    return <>{sentence}</>
  }

  return <>{terms.map((term: any, i: number) => {
    return <HighlightTerm key={i} {...term} targets={targetText} />
  })}</>
}
