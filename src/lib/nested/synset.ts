import * as dictionary from "../dictionary/dictionary"
import { SynsetLemmas } from "../dictionary/types"
import { getSynsetRelation } from "./relations"



const getSynsetLemma = (synsetId: string): SynsetLemmas => {
  const { lexicalEntry } = dictionary.getSynsetIndex(synsetId) ?? {}
  const lexs = lexicalEntry?.map(l => dictionary.getLexicalEntry(l))
  // @ts-ignore
  return lexs?.map(l => l?.lemma.writtenForm).filter(s => !!s).filter(v => !!v)
}

export const getNestedSynset = (synsetId: string) => {
  const synset = dictionary.getSynset(synsetId)
  if (!synset) {
    return null
  }
  const { synsetRelation, ...rest } = synset
  const synsetLemma = getSynsetLemma(synsetId)
  const relations = getSynsetRelation(synsetId)

  return {
    ...rest,
    lemmas: synsetLemma,
    relations,
    // synsetRelation 
  }
}
export type NestedSynsetData = ReturnType<typeof getNestedSynset>