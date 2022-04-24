
import { generateQuizSeed, seedToQuiz } from "../generateSeed"
import { expect, test } from "vitest"

test.skip("", () => {
  const word = "constitutionalize"
  const seed = generateQuizSeed(word)
  const quiz = seedToQuiz(seed)
  expect(quiz).toBe(null)
})