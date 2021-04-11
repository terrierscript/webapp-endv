import { useMemo } from "react"
import { LexicalEntry, LexicalEntryIndex, RelationRecord, Sense, Synset, SynsetLemma } from "../../lib/dictionary/types"
import { useWordNetQuery } from "./useWordNet"
import { useSynonyms } from "./lemma/CompactDefinition"

const useWordNetSynsetPartials = (synsetIds: string[] | null) => {

  const synset = useWordNetQuery<Synset>("synset", synsetIds)

  const synsetLemmas = useWordNetQuery<SynsetLemma>("synsetLemma", () => synsetIds)
  const synsetRelations = useWordNetQuery<RelationRecord[]>("synsetRelation", () => synsetIds)

  return {
    synset,
    synsetIds,
    synsetLemmas,
    synsetRelations,
  }
}

const useWordNetSensePartials = (senseIds: string[] | null) => {
  const sense = useWordNetQuery<Sense>("sense", senseIds)
  const synsetIds = useMemo(() => sense && Object.values(sense)
    .map(s => s.synset)
    .filter((s): s is string => !!s), [JSON.stringify(sense)])
  const synsets = useWordNetSynsetPartials(synsetIds ?? null)
  const senseRelations = useWordNetQuery<RelationRecord[]>("senseRelation", () => senseIds)

  return {
    sense,
    senseIds,
    synsetIds,
    senseRelations,
    ...synsets
  }
}

const useWordNetPartialsInner = (word: string) => {
  const lemma = useWordNetQuery<LexicalEntryIndex>("lemma", [word])
  const lexicalEntry = useWordNetQuery<LexicalEntry>("lexicalEntry", () => lemma?.[word]?.lexicalEntry)
  const sense = useWordNetQuery<Sense>("sense", () => lexicalEntry && Object
    .values(lexicalEntry)
    .map(l => l?.sense).flat()
    .filter((l): l is string => !!l)
  )
  const senseIds = useMemo(() => sense && Object.values(sense)
    .map(s => s.id)
    .filter((s): s is string => !!s), [JSON.stringify(sense)])
  const senseResults = useWordNetSensePartials(senseIds ?? null)
  const synset = useWordNetQuery<Synset>("synset", () => sense && Object.values(sense).map(s => s.synset)
    .filter((l): l is string => !!l)
  )
  const synonymus = useSynonyms(word, Object.values(synset ?? {}))
  const definitions = useMemo(() => synset && Object.values(synset).map(syn => syn.definition).flat(), [JSON.stringify(synset)])

  // const synsetIds = useMemo(() => sense && Object.values(sense)
  //   .map(s => s.synset)
  //   .filter((s): s is string => !!s), [JSON.stringify(sense)])

  // const synsetLemmas = useWordNetQuery<SynsetLemma>("synsetLemma", () => synsetIds)
  // const senseRelations = useWordNetQuery<RelationRecord[]>("senseRelation", () => senseIds)
  // const synsetRelations = useWordNetQuery<RelationRecord[]>("synsetRelation", () => synsetIds)

  return {
    lemma,
    lexicalEntry,
    sense,
    senseIds,
    synset,
    // synsetIds,
    // synsetLemmas,
    // senseRelations,
    // synsetRelations,
    synonymus,
    definitions,
    ...senseResults
  }
}
export type PartialDataset = ReturnType<typeof useWordNetPartialsInner>
export const useWordNetPartials = (word: string): PartialDataset => {
  return useWordNetPartialsInner(word)
}
export type SensePartialDataset = ReturnType<typeof useWordNetSensePartials>
export const useWordNetSenses = (senseIds: string[] | null): SensePartialDataset => {
  return useWordNetSensePartials(senseIds)
}
export type SynsetPartialDataset = ReturnType<typeof useWordNetSynsetPartials>
export const useWordNetSynsets = (synsetIds: string[] | null): SynsetPartialDataset => {
  return useWordNetSynsetPartials(synsetIds)
}

export type DatasetProps = { dataset: PartialDataset }
export type SenseDatasetProps = { dataset: SensePartialDataset }
export type SynseteDatasetProps = { dataset: SynsetPartialDataset }