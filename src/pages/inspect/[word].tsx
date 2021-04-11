import { GetServerSideProps, GetServerSidePropsResult, GetStaticProps, GetStaticPropsResult } from "next"
import React, { FC, useState } from "react"
import { WordNetProvider } from "../../components/inspect/useWordNet"
import { Lemma } from "../../components/inspect/lemma/Lemma"
import { LemmaHeader } from "../../components/inspect/lemma/LemmaHeader"
import { resourceHandler } from "../../lib/resources/resources"
import { Button, HStack, Input } from "@chakra-ui/react"
import { InspectWordLink } from "../../components/inspect/Link"
import { ParsedUrlQuery } from 'querystring'

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

type Result = GetStaticPropsResult<any> | GetServerSidePropsResult<any>
function getProps(query: ParsedUrlQuery): Result {
  const { word } = query
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

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const props: GetServerSidePropsResult<any> = await getProps(ctx.query)
//   // const { word } = ctx.query
//   return props
// }

export const getStaticProps: GetStaticProps = async (ctx) => {
  const result = getProps(ctx.params ?? {})
  return {
    ...result,
    revalidate: 1
  }
}


export const getStaticPaths = async () => ({
  paths: [],
  fallback: true,
})
export default Page

