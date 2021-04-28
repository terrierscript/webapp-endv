import { GetServerSideProps, GetServerSidePropsResult, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next"
import React, { FC } from "react"
import { Lemma } from "../../components/inspect/lemma/Lemma"
import { LemmaHeader } from "../../components/inspect/lemma/LemmaHeader"
import { ParsedUrlQuery } from 'querystring'
import { Search } from "../../components/inspect/Search"
import { getNestedLemma, NestedLemmaData } from "../../lib/nested/lemma"
import { useRouter } from "next/router"
import { Spinner } from "@chakra-ui/react"


export const Page: FC<{ word: string, initialWordLemmaData: NestedLemmaData }> = ({ word, initialWordLemmaData, ...rest }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <Spinner />
  }
  // console.log("init", initialWordLemmaData)
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
      word: word.toLowerCase(),
      initialWordLemmaData
      // , entry
    },
    revalidate: 300
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}
export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) {
    return { notFound: true }
  }
  const props: GetServerSidePropsResult<any> = await getProps(ctx.params)
  // const { word } = ctx.query
  return props
}

export default Page

