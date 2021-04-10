// @ts-ignore
import dictionary from "@terrierscript/normalized-global-wordnet-en"

import nlp from "compromise"
import { NextApiHandler } from "next"

const isMaybePhrasalVerb = (word: string) => {
  if (word.split(" ").length != 2) {
    return false
  }
  if (/[A-Z]/.test(word)) {
    return false
  }
  if (/\-/.test(word)) {
    return false
  }

  const terms = nlp(word).terms().json().map((t: any) => t.terms).flat()
  const maybePhrasalVerb = terms.some((term: any) => {
    const tags: string[] = term?.tags ?? []
    return tags.includes("Preposition") ||
      tags.includes("Conjunction") ||
      tags.includes("PhrasalVerb")
  })

  return maybePhrasalVerb
}

const handler: NextApiHandler = async (req, res) => {
  const aw = dictionary.getAllWords()
  const pv = aw.slice(10000, 50000).filter((a: string) => isMaybePhrasalVerb(a))

  res.json({ pv })
}

export default handler

