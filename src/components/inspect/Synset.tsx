import { HStack, Box } from "@chakra-ui/react"
import React, { useDebugValue } from "react"
import { ItemAccordion } from "../Acordion"
import { Glossaries } from "../Glossaries"
import { useWordNet } from "./useWordNet"
import { Block } from "./Block"

const PlainSynset = ({ synset }) => {
  const { definition, example, synsetRelation } = synset ?? {}
  return <Block bg="rgba(10,0,0,0.1)">
    <Glossaries definition={definition} example={example} />
    <SynsetRelations relations={synsetRelation} />
  </Block>
}

export const SynsetLemma = ({ synsetId }) => {
  const { data } = useWordNet("synsetLemma", synsetId)
  if (!data) {
    return null
  }
  // console.log(data)
  return <HStack>{data?.map(l => {
    return <Box key={l}>{l}</Box>
  })}</HStack>
}

export const SynsetsLoader = ({ synsetIds = [], relations = [] }) => {
  const { data } = useWordNet("synset", synsetIds)
  if (!data) {
    return null
  }
  return <Block>
    {synsetIds.map((target) => {
      const {relType} = relations.find(r => r.target === target) ?? {}
      const synset = data[target]
      return <Box>
        {relType && <Box>{relType}</Box>}
        <PlainSynset key={target} synset={synset} />
      </Box>
    })}
  </Block>
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

