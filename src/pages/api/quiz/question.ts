// @ts-ignore
import dictionary from "@terrierscript/normalized-global-wordnet-en"

import nlp from "compromise"
import { NextApiHandler } from "next"

const isMaybePhrasalVerb = (word: string) => {
  if (word.split("").length != 2) {
    return false
  }
  if (/[A-Z]/.test(word)) {
    return false
  }

  const terms = nlp(word).terms().json().map((t: any) => t.terms).flat()
  const maybePhrasalVerb = terms.some((term: any) => {
    return term.tags.include("Preposition") ||
      term.tags.include("Conjunction") ||
      term.tags.include("PhrasalVerb")
  })
  if (!maybePhrasalVerb) {
    console.log(terms)
  }
  return maybePhrasalVerb
}
const handler: NextApiHandler = async (req, res) => {
  console.log(dictionary)
  const aw = dictionary.getAllWords()
  aw.map((a: string) => {
    isMaybePhrasalVerb(a)
  })
  res.json({})
}

export default handler

