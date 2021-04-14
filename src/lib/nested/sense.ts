import * as dictionary from "../dictionary/dictionary"
import { Sense } from "../dictionary/types"
import { getSenseRelation } from "./relations"
import { getNestedSynset } from "./synset"

const expandNestedSense = (sense: Sense) => {
  const { senseRelation, synset, ...rest } = sense ?? {}
  const synsetNested = synset ? getNestedSynset(synset) : null
  const relations = getSenseRelation(sense.id)
  return {
    ...rest,
    ...(synsetNested && { synset: synsetNested }), // overwrite
    ...(relations && { relations })
  }

}
export const getNestedSense = (senseId: string): NestedSense | null => {
  const sense = dictionary.getSense(senseId)
  if (!sense) {
    return null
  }
  return expandNestedSense(sense)
}

type ExpandSenseData = ReturnType<typeof expandNestedSense>
type NestedSense = ExpandSenseData
export type NestedSenseData = ReturnType<typeof getNestedSense>