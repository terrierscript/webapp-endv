import { HStack, Box, Stack, Spinner } from "@chakra-ui/react"
import React, { FC } from "react"
import { ItemAccordion } from "../../Acordion"
import { Glossaries } from "./Glossaries"
import { useWordNet } from "../useWordNet"
import { BBlock } from "../Block"
import { InspectWordLink } from "../Link"
import { Relation, Synset, SynsetLemma } from "../../../lib/types"
import { RelType } from "../relation/RelType"
import { LoadSynsetRelation } from "../useSynsetGroupedRelation"

const PlainSynset: FC<{ synset: Synset, lemma: string[] }> = ({ synset, lemma = [] }) => {
  const { definition, example } = synset ?? {}
  return <>
    <HStack shouldWrapChildren wrap={"wrap"}>{lemma?.map(l => {
      console.log(l)
      return <Box key={l}>
        <InspectWordLink word={l} />
      </Box>
    })}</HStack>
    <Glossaries definition={definition} example={example} />
    {synset && <LoadSynsetRelation synsetId={synset.id} />}
  </>
}

export const SynsetsLoader: FC<{ synsetIds?: string[], relations?: Relation[] }> = ({ synsetIds = [], relations = [] }) => {
  const data = useWordNet<Synset>("synset", synsetIds)
  const lemmas = useWordNet<SynsetLemma>("synsetLemma", synsetIds)

  if (!data || !lemmas) {
    return <Spinner />
  }
  return <Stack>
    {synsetIds.map((target) => {
      const { relType } = relations
        .find(r => r.target === target) ?? {}
      const synset = data[target]
      const synsetLemma = lemmas?.[target] ?? []
      return <BBlock key={target} >
        <RelType relType={relType} />
        <PlainSynset key={target} synset={synset} lemma={synsetLemma} />
      </BBlock>
    })}
  </Stack>
}

export const SynsetRelations: FC<{ relations: Relation[] }> = ({ relations }) => {
  if (!relations) {
    return null
  }
  const synsetIds = relations.map(r => r.target)
  return <ItemAccordion title="relation">
    <SynsetsLoader synsetIds={synsetIds} relations={relations} />
  </ItemAccordion>
}

