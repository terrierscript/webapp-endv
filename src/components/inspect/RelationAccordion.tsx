import React from "react"
import { RelationRecord } from "../../lib/types"
import { ItemAccordion } from "../Acordion"
import { RelType } from "./RelType"
import { SenseItem } from "./Sense"
import { SynsetsLoader } from "./Synset"

export const RelationAccordion = ({ relations }: { relations: RelationRecord[]} ) => {
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <ItemAccordion title={relType} key={i}>
      <RelType relType={relType} />
      {(type === "sense")
        ? targets.map(target => {
          return <SenseItem key={target} senseId={target} />
        }) : <SynsetsLoader synsetIds={targets} />}
    </ItemAccordion>
  })}</>
}
