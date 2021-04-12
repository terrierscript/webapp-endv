import { Text, Box, Stack, Spinner } from "@chakra-ui/react"
import React, { FC } from "react"
import { Glossaries } from "./Glossaries"
import { useWordNetQuery } from "../useWordNet"
import { BBlock } from "../Block"
import { Sense, Synset, SynsetLemma } from "../../../lib/dictionary/types"
import { Words } from "./Words"
import { DatasetProps } from "../useDefinitions"
import { RelationAccordion } from "../relation/RelationAccordion"
import { NestedSenseData } from "../../../lib/nested/sense"
import { NestedSynsetData } from "../../../lib/nested/synset"

const PlainSynset: FC<{ synset: NestedSynsetData }> = ({ synset }) => {
  if (!synset) {
    return null
  }
  const lemma = synset?.lemma
  const { definition, example } = synset ?? {}

  return <Box id={`sysnet-${synset.id}`} boxShadow="xs" rounded={"xs"} p={2} m={2}>
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


const PlainSense: FC<{ sense: NestedSenseData }> = ({ sense }) => {
  if (!sense) {
    return null
  }
  // const {
  //   synset: synsetMap,
  //   sense: senseMap,
  //   synsetLemmas
  // } = dataset

  // const sense = senseMap?.[senseId]
  // if (!sense) return null
  // const synsetId = sense.synset
  // if (!synsetId) return null
  // const synset = sense?.synset && synsetMap?.[sense?.synset]
  // const synsetLemma = synsetLemmas?.[synsetId] ?? []
  // const senseRelation = senseMap && dataset?.senseRelations?.[sense.id]
  // const synsetRelation = dataset?.synsetRelations?.[synsetId]
  const synset = sense?.synset

  return <BBlock key={sense?.id} >
    {synset && <PlainSynset
      synset={synset}
    />}
    <Box p={2}>
      {synsetRelation && <RelationAccordion relations={synsetRelation} />}
      {senseRelation && <RelationAccordion relations={senseRelation} />}
    </Box>

  </BBlock>

}

export const SenseSynsetList: FC<{ senses: NestedSenseData[] }> = ({ senses }) => {
  return <Stack>
    {senses.map(s => {

      return s && <PlainSense key={s.id} sense={s} />
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
