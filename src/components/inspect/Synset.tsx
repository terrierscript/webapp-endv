import { HStack, Box, Stack, Spinner } from "@chakra-ui/react"
import React, { FC } from "react"
import { ItemAccordion } from "../Acordion"
import { Glossaries } from "../Glossaries"
import { useWordNet } from "./useWordNet"
import { BBlock } from "./Block"
import { InspectWordLink } from "./Link"

const PlainSynset = ({ synset,lemma = []}) => {
  const { definition, example, synsetRelation } = synset ?? {}
  // console.log("ps",synset, lemma)
  return <>
    <HStack shouldWrapChildren wrap={"wrap"}>{lemma?.map(l => {
      return <Box key={l}>
        <InspectWordLink word={l} />
      </Box>
    })}</HStack>
    <Glossaries definition={definition} example={example} />
    <SynsetRelations relations={synsetRelation} />
  </>
}

export const SynsetsLoader: FC<any> = ({ synsetIds = [], relations = [] }) => {
  const data  = useWordNet("synset", synsetIds)
  const lemmas  = useWordNet("synsetLemma", synsetIds)

  if (!data || !lemmas) {
    return <Spinner/>
  }
  return <Stack>
    {synsetIds.map((target) => {
      const { relType } = relations
        .find(r => r.target === target) ?? {}
      const synset = data[target]
      const synsetLemma = lemmas?.[target] ?? []
      return <BBlock key={target} >
        {relType && <Box>{relType}</Box>}
        <PlainSynset key={target} synset={synset} lemma={synsetLemma.lemma} />
      </BBlock>
    })}
  </Stack>
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

