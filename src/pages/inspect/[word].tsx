import { GetServerSideProps } from "next"
import React, { FC } from "react"
import { WordNetProvider } from "../../components/inspect/useWordNet"
import { Lemma } from "../../components/inspect/lemma/Lemma"
import { LemmaHeader } from "../../components/inspect/lemma/LemmaHeader"

export const Page: FC<{ word: string, initial: any }> = ({ word, initial }) => {
  return <WordNetProvider preload={initial}>
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
  // const initial = searchWords([word]) ?? {}
  const initial = {} //searchWords([word]) ?? {}
  return {
    props: {
      word,
      initial
      // , entry
    }
  }
}

export default Page

