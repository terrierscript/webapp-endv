import { Synset } from "@terrierscript/normalized-global-wordnet-en"
import { dictionary } from "../dictionary/dictionary"
import { SynsetLemmas } from "../dictionary/types"
// import { SynsetLemmas } from "../dictionary/types"



const getSynsetLemma = (synsetId: string): SynsetLemmas => {
  const { lexicalEntry } = dictionary.getSynsetIndex(synsetId) ?? {}
  const lexs = lexicalEntry?.map(l => dictionary.getLexicalEntry(l))
  // @ts-ignore
  return lexs?.map(l => l?.lemma.writtenForm).filter(s => !!s)
}

const expandSynset = (synset: Synset) => {
  const { synsetRelation, ...rest } = synset
  const synsetLemma = getSynsetLemma(synset.id)
  // @ts-ignore
  const relations = dictionary.getSynsetRelation(synset.id)

  return {
    ...rest,
    lemmas: synsetLemma,
    relations,
    // synsetRelation 
  }

}
export const getNestedSynset = (synsetId: string): NestedSense | null => {
  const synset = dictionary.getSynset(synsetId)
  if (!synset) {
    return null
  }
  return expandSynset(synset)
}

type ExpandSynsetData = ReturnType<typeof expandSynset>
type NestedSense = ExpandSynsetData

export type NestedSynsetData = ReturnType<typeof getNestedSynset>