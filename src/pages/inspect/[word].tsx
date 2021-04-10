import { GetServerSideProps } from "next"
import React, { FC, useState } from "react"
import { WordNetProvider } from "../../components/inspect/useWordNet"
import { Lemma } from "../../components/inspect/lemma/Lemma"
import { LemmaHeader } from "../../components/inspect/lemma/LemmaHeader"
import { resourceHandler } from "../../lib/resources/resources"
import { Button, HStack, Input } from "@chakra-ui/react"
import { InspectWordLink } from "../../components/inspect/Link"

const Search = () => {
  const [value, setValue] = useState("")
  return <HStack py={2}>
    <Input value={value} onChange={(e) => setValue(e.target.value)} />
    <InspectWordLink word={value}>
      <Button>Search</Button>
    </InspectWordLink>
  </HStack>
}
export const Page: FC<{ word: string, initial: any }> = ({ word, initial }) => {
  return <WordNetProvider preload={initial}>
    <Search />
    <LemmaHeader word={word} />
    <Lemma word={word} />
  </WordNetProvider>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  if (typeof word !== "string") {
    return {
      notFound: true
    }
  }
  const initial = resourceHandler("lemma", [word]) ?? {}
  return {
    props: {
      word,
      initial
      // , entry
    }
  }
}

export default Page

