import { Box } from "@chakra-ui/react"
import React, { FC } from "react"
import {  useWordNet } from "./useWordNet"
import { BBlock, Block } from "./Block"
import { SynsetsLoader } from "./Synset"
import { ItemAccordion } from "../Acordion"
import { Relation, Sense } from "../../lib/types"
import { RelType } from "./RelType"

const SenseRelation: FC<{senseRelation: Relation[]}> = ({ senseRelation = [] }) => {
  const sr = senseRelation.map(s => s.target)
  const data = useWordNet<Sense>("sense", sr) 
  if (!senseRelation || !data) {
    return null
  }
  if (senseRelation.length === 0) {
    return null
  }
  return <ItemAccordion title="sense relation">{
    <Block bg="rgba(0,0,0,0.1)">
      {senseRelation.map(({ target, relType }) => {
        return <Box key={target}>
          <RelType relType={relType} />
          {data[target] && <PlainSense sense={data[target]} />}
        </Box>
      })}
    </Block>
  }</ItemAccordion>

}

const PlainSense: FC<{ sense: Sense }>= ({ sense }) => {
  return <>
    <Box>
      <SynsetsLoader synsetIds={[sense.synset ?? ""]} />
      <SenseRelation senseRelation={sense.senseRelation ?? []} />
    </Box>
  </>
}

export const SensesLoader: FC<{senseIds: string[]}> = ({ senseIds }) => {
  const data = useWordNet<Sense>("sense", senseIds)
  if (!data) {
    return null
  }
  return <>
    {senseIds.map(id => {
      const sense = data[id]
      return <PlainSense sense={sense}/>
    })}
  </>
}
export const SenseItem = ({ senseId }: { senseId:string }) => {
  const data = useWordNet<Sense>("sense", [senseId])
  
  if (!data) {
    return null
  }
  return <BBlock>
    <PlainSense sense={data[senseId]} />
  </BBlock>
}
