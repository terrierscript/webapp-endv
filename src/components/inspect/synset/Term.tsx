import { Text, TextProps, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Portal } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import { InspectWordLink } from "../Link"
import { CompactDefinition } from "../lemma/CompactDefinition"
import nlp from "compromise"
import { HighlightProps } from "./Glossaries"

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
const TermPopover: FC<{ term: any }> = ({ term, children }) => {
  // return <>{children}</>
  if (termType(term) === "Other") {
    return <>{children}</>
  }
  return <Popover isLazy>
    <PopoverTrigger>
      <Text as="span" color="green.700" _hover={{ textDecoration: "underline" }} cursor="pointer">
        {children}
      </Text>
    </PopoverTrigger>
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <InspectWordLink word={term.text} />
        </PopoverHeader>
        <PopoverBody>
          <CompactDefinition word={term.text} />
          {/* <Lemma word={term.text} /> */}
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
}
const Term: FC<{ term: any } & TextProps> = ({ term, ...props }) => {
  return <>
    <Text {...props}>{term.pre}</Text>
    <TermPopover term={term}>
      <Text {...props}>{term.text}</Text>
    </TermPopover>
    <Text {...props}>{term.post}</Text>
  </>
}
export const SearchableText: FC<{ children: string } & TextProps & HighlightProps> = ({ children, isHighlight, ...props }) => {
  const [terms, setTerms] = useState<any[]>()
  useEffect(() => {
    const terms = nlp(children).terms().json().map((t: any) => t.terms).flat()
    setTerms(terms)
  }, [children])
  if (!terms || !isHighlight) {
    return <Text {...props}>{children}</Text>
  }
  return <>{terms.map((t: any, i: number) => {
    return <Term key={i} term={t} {...props} />
  })}</>
}
