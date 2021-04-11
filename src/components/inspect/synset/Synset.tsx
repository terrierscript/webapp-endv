import { Text, HStack, Box, Stack, Spinner } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { Glossaries } from "./Glossaries"
import { useWordNet, useWordNetQuery } from "../useWordNet"
import { BBlock } from "../Block"
import { InspectWordLink } from "../Link"
import { Relation, RelationRecord, Sense, Synset, SynsetLemma } from "../../../lib/dictionary/types"
import { RelType } from "../relation/RelType"
import { LoadSenseRelation, LoadSynsetRelation } from "../relation/RelationLoader"
import { Words } from "./Words"
import { DatasetProps } from "../useDefinitions"
import { RelationAccordion } from "../relation/RelationAccordion"

const PlainSynset: FC<{ sense?: Sense, synset: Synset, lemma: string[] }> = ({ sense, synset, lemma = [] }) => {
  const { definition, example } = synset ?? {}

  return <Box id={`sysnet-${synset.id}`}>
    {/* sense {sense?.id ?? "-"} synset: {synset.id} */}
    <Words words={lemma} />
    <Glossaries lemma={lemma} definition={definition} example={example} />
    {/* {synset && <LoadSynsetRelation synsetId={synset.id} />}
    {sense && <LoadSenseRelation sense={sense} />} */}
  </Box>
}

// const SynsetItem: FC<{ synset: Synset }> = ({ synset, synsetLemma }) => {
//   // console.log(synset)
//   // const lemmas = useWordNet<SynsetLemma>("synsetLemma", [synset?.id])
//   // const synsetLemma = lemmas?.[synset.id] ?? []

//   return <PlainSynset
//     synset={synset} lemma={synsetLemma}
//   />

// }


export const SenseSynsetList: FC<DatasetProps> = ({ dataset }) => {
  const { senseIds,
    synset: synsetMap,
    sense: senseMap,
    synsetLemmas
  } = dataset
  if (!senseIds) {
    return null
  }
  return <Stack>
    {senseIds.map((senseId) => {
      const sense = senseMap?.[senseId]
      if (!sense) return null
      const synsetId = sense.synset
      if (!synsetId) return null
      const synset = sense?.synset && synsetMap?.[sense?.synset]
      const synsetLemma = synsetLemmas?.[synsetId] ?? []
      const senseRelation = senseMap && dataset?.senseRelations?.[sense.id]
      const synsetRelation = dataset?.synsetRelations?.[synsetId]

      return <BBlock key={senseId} >
        {synset && <PlainSynset
          synset={synset} lemma={synsetLemma}
        />}
        {synsetRelation && <RelationAccordion relations={synsetRelation} />}
        {senseRelation && <RelationAccordion relations={senseRelation} />}

      </BBlock>
    })}
  </Stack>

}

export const SynsetsLoader: FC<{ synsetIds?: string[] }> = ({ synsetIds = [] }) => {
  const data = useWordNetQuery<Synset>("synset", synsetIds)
  const lemmas = useWordNetQuery<SynsetLemma>("synsetLemma", synsetIds)
  // const senseRelations = useWordNetQuery<RelationRecord[]>("senseRelation", [sense?.id])
  // const synsetRelations = useWordNetQuery<RelationRecord[]>("synsetRelation", synsetIds)

  if (!data) {
    return <Box p={4} verticalAlign="center">
      <Spinner /><Text> Loading Synset</Text>
    </Box>
  }
  return <Stack>
    {synsetIds.map((target) => {
      // const { relType } = relations
      //   .find(r => r.target === target) ?? {}
      const synset = data[target]
      const synsetLemma = lemmas?.[target] ?? []
      return <Box key={target} >
        {/* <RelType relType={relType} /> */}
        <PlainSynset
          synset={synset} lemma={synsetLemma}
        />
        {/* <SynsetItem key={target} synset={synset} synsetLemma={synsetLemma/> */}
      </Box>
    })}
  </Stack>
}
