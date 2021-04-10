import React from "react"
import { RelationRecord, Sense } from "../../../lib/dictionary/types"
import { ItemAccordion } from "../../ItemAcordion"
import { RelType } from "./RelType"
import { SenseItem } from "../sense/Sense"
import { SynsetsLoader } from "../synset/Synset"

export const RelationAccordion = ({ relations }: { relations: RelationRecord[] }) => {
  // console.log(relations)
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length} / {type})</>
    } key={i} >
      {(type === "sense")
        ? targets.map(target => {
          return <SenseItem key={target} senseId={target} />
        }) : <SynsetsLoader synsetIds={targets} />}
    </ItemAccordion>
  })}</>
}
