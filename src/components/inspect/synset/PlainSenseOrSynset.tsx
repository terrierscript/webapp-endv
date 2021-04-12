import { Box } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { BBlock } from "../Block"
import { RelationAccordion } from "../relation/RelationAccordion"
import { NestedSenseData } from "../../../lib/nested/sense"
import { NestedSynsetData } from "../../../lib/nested/synset"
import { PlainSynset } from "./Synset"

// const SynsetItem: FC<{ synset: Synset }> = ({ synset, synsetLemma }) => {
//   // console.log(synset)
//   // const lemmas = useWordNet<SynsetLemma>("synsetLemma", [synset?.id])
//   // const synsetLemma = lemmas?.[synset.id] ?? []
//   return <PlainSynset
//     synset={synset} lemma={synsetLemma}
//   />
// }
export const PlainSenseOrSynset: FC<{ item: NestedSenseData | NestedSynsetData }> = ({ item }) => {
  const [sense, synset] = useMemo(() => {
    // @ts-ignore
    const maybeSynset = item?.synset
    if (maybeSynset) {
      return [item, maybeSynset]
    }
    return [null, item]
  }, [item?.id])

  // const synset = sense?.synset
  const senseRelation = sense?.relations
  const synsetRelation = synset?.relations
  return <BBlock key={sense?.id}>
    {synset && <PlainSynset
      synset={synset} />}
    <Box p={2}>
      {synset && synsetRelation && <RelationAccordion sourceId={synset.id} relations={synsetRelation} />}
      {senseRelation && <RelationAccordion sourceId={sense.id} relations={senseRelation} />}
    </Box>

  </BBlock>
}
