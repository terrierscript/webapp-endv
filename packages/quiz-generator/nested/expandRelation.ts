import { getSenseRelation, getSynsetRelation } from "./relations"
import { getNestedSense } from "./sense"
import { getNestedSynset } from "./synset"
import { RelationRecord } from "./types"



export const getExpandRelation = (relations: RelationRecord[], targetRelType: string) => {

  return relations.filter(({ relType }) => {
    return targetRelType === relType
  }).map(rel => {
    const { targets, type } = rel
    return targets.map(t =>
      type === "synset" ? getNestedSynset(t) : getNestedSense(t)
    )
  }).flat()
}
export const getSenseRelationExpand = (senseId: string, relType: string) => {
  const relations = getSenseRelation(senseId)
  return getExpandRelation(relations, relType)
}
export const getSynsetRelationExpand = (synsetId: string, relType: string) => {
  const relations = getSynsetRelation(synsetId)
  return getExpandRelation(relations, relType)
}

export type SenseRelationExpand = ReturnType<typeof getSenseRelationExpand>
export type SynsetRelationExpand = ReturnType<typeof getSynsetRelationExpand>