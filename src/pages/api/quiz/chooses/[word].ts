import { NextApiHandler } from "next"
import {  getQuizCandidate } from "../../../../lib/quiz/quiz"

const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  const quiz = getQuizCandidate(word.toString())

  res.json(quiz)
}

export default handler

