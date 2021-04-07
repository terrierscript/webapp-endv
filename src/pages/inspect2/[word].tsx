import { GetServerSideProps } from "next"
import React, { FC } from "react"
import { WordNetProvider } from "../../components/inspect/useWordNet"
import { Lemma } from "../../components/inspect/Lemma"
import { searchWords } from "../../lib/expand"

export const Page : FC<{word:string, initial: any}>= ({ word, initial }) => {
  console.log(word)
  return <WordNetProvider preload={initial}>
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
  const initial = searchWords([word]) ?? {}
  console.log(initial)
  return {
    props: {
      word, initial
      // , entry
    }
  }
}

export default Page

