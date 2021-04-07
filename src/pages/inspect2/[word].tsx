import { GetServerSideProps } from "next"
import React, {  } from "react"
import { WordNetProvider } from "../../components/inspect/useWordNet"
import { Lemma } from "../../components/inspect/Lemma"
import { searchWords } from "../../lib/dics"

export const Page = ({ word, initial }) => {
  console.log(word)
  return <WordNetProvider preload={initial}>
    <Lemma word={word} />
  </WordNetProvider>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  const initial = searchWords([word.toString()])
  // console.log(entry)
  return {
    props: {
      word, initial
      // , entry
    }
  }
}

export default Page

