import { Text, TextProps, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Portal } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import { InspectWordLink } from "../../Link"
import { CompactDefinition } from "../lemma/CompactDefinition"
import nlp from "compromise"
// import { HighlightProps } from "./Glossaries"
import { WordPopover } from "../../WordPopover"

const termType = (term: any) => {
  const { tags } = term
  if (tags.includes("Noun"))
    return "Noun"
  if (tags.includes("Verb"))
    return "Verb"
  if (tags.includes("Adjective"))
    return "Adjective"
  if (tags.includes("Adverb"))
    return "Adverb"
  // console.log(term.text, tags)
  return "Other"
}
export const TermPopover: FC<{ term: any }> = ({ term, children }) => {
  // return <>{children}</>
  if (termType(term) === "Other") {
    return <>{children}</>
  }
  return <WordPopover word={term.text}>
    <Text as="span" color="green.700" _hover={{ textDecoration: "underline" }} cursor="pointer">
      {children}
    </Text>
  </WordPopover>
}
export const Term: FC<{ term: any } & TextProps> = ({ term, ...props }) => {
  return <>
    <Text {...props}>{term.pre}</Text>
    <TermPopover term={term}>
      <Text {...props}>{term.text}</Text>
    </TermPopover>
    <Text {...props}>{term.post}</Text>
  </>
}
export const SearchableText: FC<{ children: string } & TextProps> = ({ children, ...props }) => {
  const textProps: TextProps = {
    as: "span",
    ...props
  }
  const [terms, setTerms] = useState<any[]>()
  useEffect(() => {
    setTimeout(() => {

      const terms = nlp(children).terms().json().map((t: any) => t.terms).flat()
      setTerms(terms)
    }, 100)
  }, [children])
  if (!terms) {
    return <Text {...textProps}>{children}</Text>
  }
  return <>{terms.map((t: any, i: number) => {
    return <Term key={i} term={t} {...textProps} />
  })}</>
}
