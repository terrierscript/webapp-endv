import { Relation, RelationRecord } from "../dictionary/types"
import { getSynsetRelation } from "./relations"
import { getNestedSense } from "./sense"
import { getNestedSynset } from "./synset"


export const getExpandRelation = (relations: RelationRecord[]) => {
  return relations.map(rel => {
    const { targets, type } = rel
    return {
      ...rel,
      targets: targets.map(t =>
        type === "synset" ? getNestedSynset(t) : getNestedSense(t)
      )
    }
  })
}
export const getSenseRelationExpand = (senseId: string) => {
  const relations = getSynsetRelation(senseId)
  return getExpandRelation(relations)
}
export const getSynsetRelationExpand = (synsetId: string) => {
  const relations = getSynsetRelation(synsetId)
  return getExpandRelation(relations)
}