import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import React from "react"
import { Quiz } from "../../components/quiz/Quiz"

export default function QuizPage({ word }: { word: string }) {
  return <Quiz word={word} />
}

export const getStaticProps: GetStaticProps = async (req) => {
  const seed: string = req.params?.seed?.toString() ?? ""
  return {
    props: { word: seed }
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  return { 
    paths:[],
    fallback: "blocking"
  }
}