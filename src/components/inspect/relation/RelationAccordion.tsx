import React, { FC } from "react"
import { RelationRecord, Sense } from "../../../lib/dictionary/types"
import { ItemAccordion } from "../../ItemAcordion"
import { RelType } from "./RelType"
import { SenseItem } from "../sense/Sense"
import { SynsetsLoader } from "../synset/Synset"
import { DatasetProps } from "../useDefinitions"

export const RelationAccordion = ({ relations }: { relations: RelationRecord[] }) => {
  // console.log(relations)
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length})</>
    } key={i} >
      {(type === "sense")
        ? targets.map(target => {
          return <SenseItem key={target} senseId={target} />
        }) : <SynsetsLoader synsetIds={targets} />}
    </ItemAccordion>
  })}</>
}

export const SynsetRelationAccordion: FC<DatasetProps & { synsetId: string }> = ({ synsetId, dataset }) => {
  const { synsetRelations } = dataset
  const relations = synsetRelations?.[synsetId]
  // console.log(relations)
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length})</>
    } key={i} >
      <SynsetsLoader synsetIds={targets} />
    </ItemAccordion>
  })}</>
}

// export const SenseRelationAccordion: FC<DatasetProps & { senseId: string }> = ({ senseId, dataset }) => {
//   const { senseRelations } = dataset
//   const relations = senseRelations?.[senseId]
//   // console.log(relations)
//   return <>{relations?.map(({ relType, targets, type }, i) => {
//     return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length})</>
//     } key={i} >
//       <SenseItem key={target} senseId={target}
//     </ItemAccordion>
//   })}</>
// }
