import { useMemo } from "react"
import { LexicalEntry, LexicalEntryIndex, RelationRecord, Sense, Synset, SynsetLemma } from "../../lib/dictionary/types"
import { useWordNetQuery } from "./useWordNet"
import { useSynonyms } from "./lemma/CompactDefinition"

const useWordNetPartialsInner = (word: string) => {
  const lemma = useWordNetQuery<LexicalEntryIndex>("lemma", [word])
  const lexicalEntry = useWordNetQuery<LexicalEntry>("lexicalEntry", () => lemma?.[word]?.lexicalEntry)
  const sense = useWordNetQuery<Sense>("sense", () => lexicalEntry && Object
    .values(lexicalEntry)
    .map(l => l?.sense).flat()
    .filter((l): l is string => !!l)
  )
  const synset = useWordNetQuery<Synset>("synset", () => sense && Object.values(sense).map(s => s.synset)
    .filter((l): l is string => !!l)
  )
  const synonymus = useSynonyms(word, Object.values(synset ?? {}))
  const definitions = useMemo(() => synset && Object.values(synset).map(syn => syn.definition).flat(), [JSON.stringify(synset)])

  const senseIds = useMemo(() => sense && Object.values(sense)
    .map(s => s.id)
    .filter((s): s is string => !!s), [JSON.stringify(sense)])
  const synsetIds = useMemo(() => sense && Object.values(sense)
    .map(s => s.synset)
    .filter((s): s is string => !!s), [JSON.stringify(sense)])

  const synsetLemmas = useWordNetQuery<SynsetLemma>("synsetLemma", () => synsetIds)
  const senseRelations = useWordNetQuery<RelationRecord[]>("senseRelation", () => senseIds)
  const synsetRelations = useWordNetQuery<RelationRecord[]>("synsetRelation", () => synsetIds)

  return {
    lemma,
    lexicalEntry,
    sense,
    senseIds,
    synset,
    synsetIds,
    synsetLemmas,
    senseRelations,
    synsetRelations,
    synonymus,
    definitions
  }
}
export type PartialDataset = ReturnType<typeof useWordNetPartialsInner>
export const useWordNetPartials = (word: string): PartialDataset => {
  return useWordNetPartialsInner(word)
}

export type DatasetProps = { dataset: PartialDataset }