import { Box } from "@chakra-ui/react"
import React, { FC } from "react"
import { useWordNet } from "./useWordNet"
import { Block } from "./Block"
import { SynsetLemma, SynsetsLoader } from "./Synset"
import { ItemAccordion } from "../Acordion"

const SenseRelation : FC<any> = ({ senseRelation }) => {
  const sr = senseRelation.map(s => s.target)
  const { data } = useWordNet("sense", sr) 
  if (!senseRelation || !data) {
    return null
  }

  return senseRelation.map(({target,relType}) => {
    return <Box>
      <Box>{relType}</Box>
      <PlainSense sense={data[target]} />
    </Box>
  })
}

const PlainSense = ({ sense }) => {
  return <Block>
    <Box>
      <SynsetLemma synsetId={sense.synset} />
      <SynsetsLoader synsetIds={[sense.synset]} />
      <ItemAccordion title="sense relation">
        <SenseRelation senseRelation={sense.senseRelation} />
      </ItemAccordion>
    </Box>
  </Block>
}

export const SensesLoader = ({ senseIds }) => {
  const { data } = useWordNet("sense", senseIds)
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
  const { data } = useWordNet("sense", senseId)
  if (!data) {
    return null
  }
  return <Block>
    <PlainSense sense={data} />
  </Block>
}
