import { GetServerSideProps } from "next"
import React from "react"
import { Quiz } from "../../components/quiz/Quiz"

export default function QuizPage({ word }: { word: string }) {
  return <Quiz word={word} />
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const seed: string = req.query.seed?.toString() ?? ""

  return {
    props: { word: seed }
  }
}