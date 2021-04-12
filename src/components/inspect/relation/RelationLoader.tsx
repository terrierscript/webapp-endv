import React from "react"
import { Sense, RelationRecord } from "../../../lib/dictionary/types"
import { RelationAccordion } from "./RelationAccordion"
import { useWordNetQuery } from "../useWordNet"
import { FC } from "react"
import { ItemAccordion } from "../../ItemAcordion"

export const LoadSenseRelation = ({ sense }: { sense: Sense }) => {
  // console.log(sense)
  // const { senseRelation, synsetRelation } = useSynsetGroupedRelation(sense)
  const relations = useWordNetQuery<RelationRecord[]>("senseRelation", [sense?.id])
  const rel = relations?.[sense.id]
  if (!rel) {
    return null
  }
  return <RelationAccordion relations={rel} />
}
export const LoadSynsetRelation = ({ synsetId }: { synsetId: string }) => {
  // const { senseRelation, synsetRelation } = useSynsetGroupedRelation(sense)
  const relations = useWordNetQuery<RelationRecord[]>("synsetRelation", [synsetId])
  const rel = relations?.[synsetId]
  if (!rel) {
    return null
  }
  return <RelationAccordion relations={rel} />
}
