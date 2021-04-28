// @ts-ignore
import dictionary from "@terrierscript/normalized-global-wordnet-en"
import { LexicalEntry, Sense, Synset, LemmaIndex, Behaviors, SenseIndexRelation } from "./types"

export const getLemma = (id: string | undefined): LemmaIndex | undefined => {
  console.log("getLemma", id)
  return id && dictionary.getLemma(id)
}
export const getLexicalEntry = (id: string | undefined): LexicalEntry | undefined => {
  console.log("getLexicalEntry", id)
  return id && dictionary.getLexicalEntry(id)
}
export const getSense = (id: string | undefined): Sense | undefined => {
  console.log("getSense", id)
  return id && dictionary.getSense(id)
}

export const getSenseIndex = (id: string | undefined): SenseIndexRelation[] | undefined => {
  console.log("getSenseIndex", id)
  return id && dictionary.getSenseIndex(id)
}

export const getSynset = (id: string | undefined): Synset | undefined => {
  console.log("getSynset", id)
  return id && dictionary.getSynset(id)
}

export const getSynsetIndex = (id: string | undefined): LemmaIndex | undefined => {
  console.log("getSynsetIndex", id)
  return id && dictionary.getSynsetIndex(id)
}

export const getSyntacticBehaviour = (id: string | undefined): Behaviors | undefined => {
  console.log("getSyntacticBehaviour", id)
  return id && dictionary.getSyntacticBehaviour(id)
}
