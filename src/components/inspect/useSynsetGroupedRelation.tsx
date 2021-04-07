import React, { useMemo } from "react"
import { LexicalEntry, Relation, RelationMap, Sense, SenseRelation, RelationRecord, Synset } from "../../lib/types"
import { ItemAccordion } from "../Acordion"
import { RelationAccordion } from "./RelationAccordion"
import { RelType } from "./RelType"
import { useWordNet } from "./useWordNet"

// type Param = { lexicalEntryId: string; synsetId: string; senseIds: string[] }


// const groupingRelation = (relations: Relation[] = []): RelationMap => {
//   const map = new Map()
//   relations.map((rel) => {
//     const { relType } = rel
//     const m = map.get(relType) ?? []
//     map.set(relType, [...m, rel.target])
//   })
//   return Object.fromEntries(map)
// }

// export const useSynsetGroupedRelation = (sense: Sense) => {
//   const synsetMap = useWordNet<Synset>("synset", [sense?.synset])
//   const synset = useMemo(() => synsetMap?.[sense?.synset], [JSON.stringify(synsetMap)])
//   const senseRelation = sense.senseRelation ?? []
//   const synsetRelation = synset?.synsetRelation ?? []
//   console.log(senseRelation, synsetRelation)
//   return { senseRelation, synsetRelation}
// }

// // export const RelationExpands = ({ groups, target }: any) => {
// //   return <>
// //     {Object.entries(groups).map(([relType, ids]) => {
// //       return <>
// //         <ItemAccordion title={relType}>
// //           <RelType relType={relType} />
// //           {/* {target === "synset" ? <>} */}
// //         </ItemAccordion>
// //       </>
// //     })}
// //   </>
// // }

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