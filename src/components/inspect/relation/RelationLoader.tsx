import React from "react"
import { Sense, RelationRecord } from "../../../lib/types"
import { RelationAccordion } from "./RelationAccordion"
import { useWordNet } from "../useWordNet"

export const LoadSenseRelation = ({ sense }: { sense: Sense }) => {
  // const { senseRelation, synsetRelation } = useSynsetGroupedRelation(sense)
  const relations = useWordNet<RelationRecord[]>("senseRelation", [sense.id])
  const rel = relations?.[sense.id]
  if (!rel) {
    return null
  }
  return <RelationAccordion relations={rel} />
}
export const LoadSynsetRelation = ({ synsetId }: { synsetId: string }) => {
  // const { senseRelation, synsetRelation } = useSynsetGroupedRelation(sense)
  const relations = useWordNet<RelationRecord[]>("synsetRelation", [synsetId])
  const rel = relations?.[synsetId]
  if (!rel) {
    return null
  }
  return <RelationAccordion relations={rel} />
}

export const LoadSenseSynsetRelation = ({ senseId }: { senseId: string }) => {
  // const { senseRelation, synsetRelation } = useSynsetGroupedRelation(sense)
  const relations = useWordNet<RelationRecord[]>("senseSynsetRelation", [senseId])
  const rel = relations?.[senseId]
  if (!rel) {
    return null
  }
  return <RelationAccordion relations={rel} />
}

// senseSynsetRelation