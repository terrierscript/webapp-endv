import { NextApiHandler } from "next"
import { generateQuizzes } from "../../../../lib/quiz/quiz"

const handler: NextApiHandler = async (req, res) => {
  const { word } = req.query
  const quiz = generateQuizzes(word.toString())

  res.json(quiz)
}

export default handler

