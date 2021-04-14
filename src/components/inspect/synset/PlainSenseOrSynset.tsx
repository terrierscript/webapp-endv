import { Box } from "@chakra-ui/react"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { BBlock } from "../Block"
import { RelationAccordion } from "../relation/RelationAccordion"
import { NestedSenseData } from "../../../lib/nested/sense"
import { NestedSynsetData } from "../../../lib/nested/synset"
import { PlainSynset } from "./Synset"
import { LazyLoadingAccordion } from "../../LazyLoadAccordion"
import { LazyElement } from "../LazyElement"

const Relation: FC<any> = ({ synset, synsetRelation, sense, senseRelation }) => {

  // return <LazyLoadingAccordion title="more">
  return <Box p={2}>
    {synset && synsetRelation && <RelationAccordion sourceId={synset.id} relations={synsetRelation} />}
    {sense && senseRelation && <RelationAccordion sourceId={sense.id} relations={senseRelation} />}
  </Box>
  // </LazyLoadingAccordion>
}

const isSenseData = (item: NestedSynsetData | NestedSenseData): item is NestedSenseData => {
  return item !== null && "synset" in item
}

export const PlainSenseOrSynset: FC<{ item: NestedSynsetData | NestedSenseData, more?: boolean }> = ({ item, more = true }) => {

  const [sense, synset]: [NestedSenseData, NestedSynsetData | null] = useMemo(() => {
    if (item === null) {
      return [null, null]
    }
    if (isSenseData(item)) {
      // if ("synset" in item) {
      const maybeSynset = item?.synset
      return [item, maybeSynset ?? null]
    }
    return [null, item]
  }, [item?.id])

  // const synset = sense?.synset
  const senseRelation = sense?.relations
  const synsetRelation = synset?.relations
  return <BBlock>
    <LazyElement>
      {synset ? <PlainSynset synset={synset} /> : null}
      <Relation {...{ synset, synsetRelation, sense, senseRelation }} />
    </LazyElement>
  </BBlock>
}
