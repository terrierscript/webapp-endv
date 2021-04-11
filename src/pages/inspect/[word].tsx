import { GetServerSideProps, GetServerSidePropsResult, GetStaticProps, GetStaticPropsResult } from "next"
import React, { FC } from "react"
import { WordNetProvider } from "../../components/inspect/WordNetContext"
import { Lemma } from "../../components/inspect/lemma/Lemma"
import { LemmaHeader } from "../../components/inspect/lemma/LemmaHeader"
import { resourceHandler } from "../../lib/resources/resources"
import { ParsedUrlQuery } from 'querystring'
import { Search } from "../../components/inspect/Search"

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

