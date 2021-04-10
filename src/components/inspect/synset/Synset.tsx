import { HStack, Box, Stack, Spinner } from "@chakra-ui/react"
import React, { FC } from "react"
import { ItemAccordion } from "../../Acordion"
import { Glossaries } from "./Glossaries"
import { useWordNet } from "../useWordNet"
import { BBlock } from "../Block"
import { InspectWordLink } from "../Link"
import { Relation, Sense, Synset, SynsetLemma } from "../../../lib/types"
import { RelType } from "../relation/RelType"
import { LoadSenseRelation, LoadSynsetRelation } from "../relation/RelationLoader"

const PlainSynset: FC<{ sense?: Sense, synset: Synset, lemma: string[] }> = ({ sense, synset, lemma = [] }) => {
  const { definition, example } = synset ?? {}

  return <BBlock>
    {/* sense {sense?.id ?? "-"} synset: {synset.id} */}
    <HStack shouldWrapChildren wrap={"wrap"}>{lemma?.map(l => {
      return <Box key={l} textDecoration="underline">
        <InspectWordLink word={l} />
      </Box>
    })}</HStack>
    <Glossaries definition={definition} example={example} />
    {synset && <LoadSynsetRelation synsetId={synset.id} />}
    {sense && <LoadSenseRelation sense={sense} />}
    {/* <MoreRelations sense={sense} /> */}
  </BBlock>
}

const SynsetItem: FC<{ synset: Synset }> = ({ synset }) => {
  const lemmas = useWordNet<SynsetLemma>("synsetLemma", [synset.id])
  const synsetLemma = lemmas?.[synset.id] ?? []

  return <PlainSynset
    synset={synset} lemma={synsetLemma}
  />

}
export const SynsetsLoader: FC<{
  // sense: Sense,
  synsetIds?: string[], relations?: Relation[]
}> = ({
  // sense,
  synsetIds = [], relations = [] }) => {
    const data = useWordNet<Synset>("synset", synsetIds)
    // const lemmas = useWordNet<SynsetLemma>("synsetLemma", synsetIds)

    if (!data) {
      return <Spinner />
    }
    return <Stack>
      {synsetIds.map((target) => {
        const { relType } = relations
          .find(r => r.target === target) ?? {}
        const synset = data[target]
        // const synsetLemma = lemmas?.[target] ?? []
        return <Box key={target} >
          <RelType relType={relType} />
          <SynsetItem
            // sense={sense}
            key={target} synset={synset} />
        </Box>
      })}
    </Stack>
  }

// export const SynsetRelations: FC<{ relations: Relation[] }> = ({ relations }) => {
//   if (!relations) {
//     return null
//   }
//   const synsetIds = relations.map(r => r.target)
//   return <ItemAccordion title="relation">
//     <SynsetsLoader synsetIds={synsetIds} relations={relations} />
//   </ItemAccordion>
// }

