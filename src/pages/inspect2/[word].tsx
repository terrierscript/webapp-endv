import { GetServerSideProps } from "next"
import React, {  } from "react"
import { WordNetProvider } from "../../components/inspect/useWordNet"
import { Lemma } from "../../components/inspect/Lemma"

export const Page = ({ word }) => {
  console.log(word)
  return <WordNetProvider>
    <Lemma word={word} />
  </WordNetProvider>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  // const entry = searchWord(word.toString())
  // console.log(entry)
  return {
    props: {
      word
      // , entry
    }
  }
}

export default Page

function searchWord(arg0: string) {
  throw new Error("Function not implemented.")
}
