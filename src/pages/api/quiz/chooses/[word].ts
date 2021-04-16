import { NextApiHandler } from "next"
import { getQuizCandidate, getQuizCandidateRaw } from "../../../../lib/quiz/quiz"

const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  const quiz = getQuizCandidateRaw(word.toString())

  res.json(quiz)
}

export default handler

