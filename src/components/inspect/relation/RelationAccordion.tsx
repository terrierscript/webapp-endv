import React from "react"
import { RelationRecord, Sense } from "../../../lib/types"
import { ItemAccordion } from "../../Acordion"
import { RelType } from "./RelType"
import { SenseItem } from "../sense/Sense"
import { SynsetsLoader } from "../synset/Synset"

export const RelationAccordion = ({ sense, relations }: { sense: Sense, relations: RelationRecord[] }) => {
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length} / {type})</>
    } key={i} >
      {(type === "sense")
        ? targets.map(target => {
          return <SenseItem key={target} senseId={target} />
        }) : <SynsetsLoader sense={sense} synsetIds={targets} />}
    </ItemAccordion>
  })}</>
}
