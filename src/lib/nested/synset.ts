import * as dictionary from "../dictionary/dictionary"
import { SynsetLemma } from "../dictionary/types"
import { getSynsetRelation } from "./relations"



const getSynsetLemma = (synsetId: string): SynsetLemma => {
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
  const relation = getSynsetRelation(synsetId)

  return {
    ...rest,
    lemma: synsetLemma,
    relation,
    // synsetRelation 
  }
}
export type NestedSynsetData = ReturnType<typeof getNestedSynset>