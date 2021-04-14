import { Box } from "@chakra-ui/react"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { BBlock } from "../Block"
import { RelationAccordion } from "../relation/RelationAccordion"
import { NestedSenseData } from "../../../lib/nested/sense"
import { NestedSynsetData } from "../../../lib/nested/synset"
import { PlainSynset } from "./Synset"
import { LazyLoadingAccordion } from "../../LazyLoadAccordion"
import { LazyElement } from "../Intersecting"

const Relation: FC<any> = ({ synset, synsetRelation, sense, senseRelation }) => {

  return <LazyLoadingAccordion title="more">
    <Box p={2}>
      {synset && synsetRelation && <RelationAccordion sourceId={synset.id} relations={synsetRelation} />}
      {sense && senseRelation && <RelationAccordion sourceId={sense.id} relations={senseRelation} />}
    </Box>
  </LazyLoadingAccordion>
}

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
  return <BBlock>
    <LazyElement>
      {synset && <PlainSynset synset={synset} />}
      <Relation {...{ synset, synsetRelation, sense, senseRelation }} />
    </LazyElement>
  </BBlock>
}
