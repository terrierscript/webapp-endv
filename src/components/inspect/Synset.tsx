import { HStack, Box } from "@chakra-ui/react"
import React, { FC, useDebugValue } from "react"
import { ItemAccordion } from "../Acordion"
import { Glossaries } from "../Glossaries"
import { useWordNet } from "./useWordNet"
import { Block } from "./Block"

const PlainSynset = ({ synset,lemma }) => {
  const { definition, example, synsetRelation } = synset ?? {}
  return <Block bg="rgba(10,0,0,0.1)">
    <HStack>{lemma?.map(l => {
      return <Box key={l}>{l}</Box>
    })}</HStack>
    <Glossaries definition={definition} example={example} />
    <SynsetRelations relations={synsetRelation} />
  </Block>
}

export const SynsetLemma = ({ synsetId }) => {
  const data = useWordNet("synsetLemma", synsetId)
  if (!data) {
    return null
  }
  // console.log(data)
  return <HStack>{data?.map(l => {
    return <Box key={l} color="blue.500">{l}</Box>
  })}</HStack>
}

export const SynsetsLoader: FC<any> = ({ synsetIds = [], relations = [] }) => {
  const  data  = useWordNet("synset", synsetIds)
  const lemmas  = useWordNet("synsetLemma", synsetIds)

  if (!data || !lemmas) {
    return null
  }
  return synsetIds.map((target) => {
    const { relType } = relations
      .find(r => r.target === target) ?? {}
    const synset = data[target]
    const lemma = lemmas?.[target] ?? []
    return <Box>
      {relType && <Box>{relType}</Box>}
      <PlainSynset key={target} synset={synset} lemma={lemma}/>
    </Box>
  })
}

export const SynsetRelations = ({ relations }) => {
  if (!relations) {
    return null
  }
  const synsetIds = relations.map(r => r.target)
  return <ItemAccordion title="relation">
    <SynsetsLoader synsetIds={synsetIds} relations={relations} />
  </ItemAccordion>
}

