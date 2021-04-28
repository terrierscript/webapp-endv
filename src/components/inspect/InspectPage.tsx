import { GetServerSidePropsResult, GetStaticPropsResult } from "next"
import React, { FC } from "react"
import { Lemma } from "./lemma/Lemma"
import { LemmaHeader } from "./lemma/LemmaHeader"
import { ParsedUrlQuery } from 'querystring'
import { Search } from "./Search"
import { getNestedLemma, NestedLemmaData } from "../../lib/nested/lemma"


export const InspectPage: FC<{ word: string; initialWordLemmaData: NestedLemmaData }> = ({ word, initialWordLemmaData, ...rest }) => {
  // console.log("init", initialWordLemmaData)
  // console.log("init", rest)
  return <>
    <Search />
    <LemmaHeader word={word} />
    <Lemma word={word} initialData={initialWordLemmaData} />
  </>
}

type GetProps = GetStaticPropsResult<any> | GetServerSidePropsResult<any>

export function getProps(query: ParsedUrlQuery): GetProps {
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
