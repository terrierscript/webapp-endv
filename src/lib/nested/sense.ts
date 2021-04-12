import * as dictionary from "../dictionary/dictionary"
import { getNestedSynset } from "./synset"

export const getNestedSense = (senseId: string) => {
  const sense = dictionary.getSense(senseId)
  const synset = sense?.synset && getNestedSynset(sense.synset)
  return {
    ...sense,
    $: {
      synset
    }
  }
}
