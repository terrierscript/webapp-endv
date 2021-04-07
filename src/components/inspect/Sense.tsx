import { Box } from "@chakra-ui/react"
import React, { FC } from "react"
import {  useWordNet } from "./useWordNet"
import { Block } from "./Block"
import {  SynsetsLoader } from "./Synset"
import { ItemAccordion } from "../Acordion"

const SenseRelation: FC<any> = ({ senseRelation = [] }) => {
  const sr = senseRelation.map(s => s.target)
  const data = useWordNet("sense", sr) 
  if (!senseRelation || !data) {
    return null
  }
  if (senseRelation.length === 0) {
    return null
  }
  return <ItemAccordion title="sense relation">{
    senseRelation.map(({ target, relType }) => {
      return <Box key={target}>
        <Box>{relType}</Box>
        <PlainSense sense={data[target]} />
      </Box>
    })
  }</ItemAccordion>

}

const PlainSense = ({ sense }) => {
  return <>
    <Box>
      <SynsetsLoader synsetIds={[sense.synset]} />
      <SenseRelation senseRelation={sense.senseRelation} />
    </Box>
  </>
}

export const SensesLoader = ({ senseIds }) => {
  const data = useWordNet("sense", senseIds)
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
export const Sense = ({ senseId }) => {
  const data = useWordNet("sense", senseId)
  
  if (!data) {
    return null
  }
  return <>
    <PlainSense sense={data} />
  </>
}
