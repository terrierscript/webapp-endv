import { useMemo } from "react"
import { LexicalEntry, LexicalEntryIndex, RelationRecord, Sense, Synset, SynsetLemma } from "../../lib/dictionary/types"
import { useWordNetQuery } from "./useWordNet"
import { useSynonyms } from "./lemma/CompactDefinition"

export const useDefinitions = (word: string) => {
  const lemma = useWordNetQuery<LexicalEntryIndex>("lemma", [word])
  const lex = useWordNetQuery<LexicalEntry>("lexicalEntry", () => lemma?.[word]?.lexicalEntry)
  const sense = useWordNetQuery<Sense>("sense", () => lex && Object
    .values(lex)
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
    sense,
    synset,
    synsetLemmas,
    senseRelations,
    synsetRelations,
    synonymus,
    definitions
  }
}
