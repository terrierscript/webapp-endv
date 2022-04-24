
import { expect, test } from "vitest"
import { filterFuzzyUnmatch } from "../filterFuzzyUnmatch"

test("filterFuzzyUnmatch", () => {
  const word = "constitutionalize"
  const filter = filterFuzzyUnmatch(word, ["constitutionalise", "book"])
  expect(filter).toEqual(["book"])
})

test("filterFuzzyUnmatch", () => {
  const word = "book"
  const filter = filterFuzzyUnmatch(word, ["book", "books", "booking", "dog"])

  expect(filter).toEqual(["dog"])
})