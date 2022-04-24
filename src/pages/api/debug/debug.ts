import { NextApiHandler } from "next"
import { generateRandomQuiz } from "../../../../packages/quiz-generator/quiz/generateSeed"

const postQuiz = async () => {
  const quiz = generateRandomQuiz()

  return {
    quiz
  }
}
const handler: NextApiHandler = async (req, res) => {
  const result = await postQuiz()
  const token = Buffer.from(JSON.stringify(result)).toString('base64').replace(/\=/g, "")
  res.statusCode = 200
  res.json({ result, token })
}
export default handler
