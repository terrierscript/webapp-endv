import { Box, Divider } from "@chakra-ui/react"
import React, { FC } from "react"
import { useWordNet } from "../useWordNet"
import { BBlock } from "../Block"
import { SynsetsLoader } from "../synset/Synset"
import { Sense } from "../../../lib/types"
import {
  LoadSenseRelation,
  // LoadSenseSynsetRelation,
  LoadSynsetRelation,
  // Relations
} from "../relation/RelationLoader"

const PlainSense: FC<{
  sense: Sense
}> = ({
  sense
}) => {
    return <>
      <Box>
        <SynsetsLoader
          // sense={sense}
          synsetIds={[sense.synset ?? ""]} />
      </Box>
    </>
  }

export const SenseItem = ({ senseId }: { senseId: string }) => {
  const data = useWordNet<Sense>("sense", [senseId])
  if (!data) {
    return null
  }
  const sense = data[senseId]
  return <BBlock>
    {/* sense:{sense.id} */}
    <PlainSense sense={sense} />
    {/* <Box>--</Box>
    <LoadSenseSynsetRelation senseId={sense.id} /> */}
  </BBlock>
}
