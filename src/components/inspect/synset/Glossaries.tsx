import { Text, Box, Wrap, TextProps, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Portal } from "@chakra-ui/react"
import React, { FC } from "react"
import nlp from "compromise"
import { Lemma } from "../lemma/Lemma"
import { InspectWordLink } from "../Link"


const termType = (term: any) => {
  const { tags } = term
  if (tags.includes("Noun")) return "Noun"
  if (tags.includes("Verb")) return "Verb"
  if (tags.includes("Adjective")) return "Adjective"
  if (tags.includes("Adverb")) return "Adverb"
  console.log(term.text, tags)
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
          <InspectWordLink word={term.text} >
            {term.text}
          </InspectWordLink>
        </PopoverHeader>
        <PopoverBody>
          <Lemma word={term.text} />
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
const SearchableText: FC<{ children: string } & TextProps> = ({ children, ...props }) => {
  const terms = nlp(children).terms().json().map((t: any) => t.terms).flat()
  return <>{terms.map((t: any, i: number) => {
    // console.log(t)
    return <Term key={i} term={t} {...props} />
  })}</>
  // console.log(terms)
  // return <Box>{text}</Box>
}

type Example = string | {
  "dc:source": string
  "#text": string
}
export const Glossaries = ({ definition, example }: { definition: string[], example: Example[] }) => {
  const examples = example?.join(" / ")
  return <Box p={2}>
    {definition && <Wrap align="center">

      {definition.map(def => {
        return <Box key={def}>
          <SearchableText as="b">{def}</SearchableText>
        </Box>
      })}
      {/* <Text as="b">{definition}</Text> */}
    </Wrap>
    }
    {examples && <Text as="small">{examples}</Text>}
  </Box>
}
