import * as dictionary from "../dictionary/dictionary"
import { getSenseRelation } from "./relations"
import { getNestedSynset } from "./synset"

export const getNestedSense = (senseId: string) => {
  const sense = dictionary.getSense(senseId)
  if (!sense) {
    return null
  }
  const { senseRelation, synset, ...rest } = sense ?? {}
  const synsets = synset ? getNestedSynset(synset) : null
  const relations = getSenseRelation(senseId)
  return {
    ...rest,
    synsets,
    relations
  }
}

export type NestedSenseData = ReturnType<typeof getNestedSense>