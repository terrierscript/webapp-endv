import { Box } from "@chakra-ui/react"
import React, { FC, useMemo } from "react"
import { BBlock } from "../Block"
import { RelationAccordion } from "../relation/RelationAccordion"
import { NestedSenseData } from "../../../lib/nested/sense"
import { NestedSynsetData } from "../../../lib/nested/synset"
import { PlainSynset } from "./Synset"

// const Relations = () => {

// }
export const PlainSenseOrSynset: FC<{ item: NestedSenseData | NestedSynsetData, more?: boolean }> = ({ item, more = true }) => {
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
  return <BBlock >

    {synset && <PlainSynset synset={synset} />}
    {/* <ItemAccordion title="more"> */}

    <Box p={2}>
      {synset && synsetRelation && <RelationAccordion sourceId={synset.id} relations={synsetRelation} />}
      {sense && senseRelation && <RelationAccordion sourceId={sense.id} relations={senseRelation} />}
    </Box>

    {/* </ItemAccordion> */}
  </BBlock>
}
