import { expect, test } from "vitest"
import { generateQuizSeed } from "../quiz/generateSeed"

test("get synonym", () => {
  const data = generateQuizSeed("dog")
  expect(data).toMatchSnapshot()
})
test("get synonym", () => {
  const data = generateQuizSeed("cat")
  expect(data).toMatchSnapshot()
})