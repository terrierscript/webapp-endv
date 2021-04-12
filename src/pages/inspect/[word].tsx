import { GetServerSideProps, GetServerSidePropsResult, GetStaticProps, GetStaticPropsResult } from "next"
import React, { FC } from "react"
import { Lemma } from "../../components/inspect/lemma/Lemma"
import { LemmaHeader } from "../../components/inspect/lemma/LemmaHeader"
import { ParsedUrlQuery } from 'querystring'
import { Search } from "../../components/inspect/Search"
import { getNestedLemma, NestedLemmaData } from "../../lib/nested/lemma"

export const Page: FC<{ word: string, initialWordLemmaData: NestedLemmaData }> = ({ word, initialWordLemmaData, ...rest }) => {
  console.log("init", initialWordLemmaData)
  // console.log("init", rest)
  return <>
    <Search />
    <LemmaHeader word={word} />
    <Lemma word={word} initialData={initialWordLemmaData} />
  </>
}

type Result = GetStaticPropsResult<any> | GetServerSidePropsResult<any>
function getProps(query: ParsedUrlQuery): Result {
  const { word } = query
  if (typeof word !== "string") {
    return {
      notFound: true
    }
  }
  const initialWordLemmaData = getNestedLemma(word)
  // console.log(initialWordLemmaData)
  return {
    props: {
      word,
      initialWordLemmaData
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

