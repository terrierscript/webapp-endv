import * as dictionary from "../dictionary/dictionary"
import { getSenseRelation } from "./relations"
import { getNestedSynset } from "./synset"

export const getNestedSense = (senseId: string) => {
  const sense = dictionary.getSense(senseId)
  if (!sense) {
    return null
  }
  const { senseRelation, ...rest } = sense
  const synset = sense?.synset && getNestedSynset(sense.synset)
  const relations = getSenseRelation(senseId)
  return {
    ...rest,
    synset, // overwrite synset
    relations
  }
}
