import React from "react"
import { useWordNet } from "../useWordNet"
import { BBlock } from "../Block"
import { SynsetsLoader } from "../synset/Synset"
import { Sense } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"

export const SenseItem = ({ senseId }: { senseId: string }) => {
  const data = useWordNet<Sense>("sense", [senseId])
  if (!data) {
    return <Loading>Loading sense..</Loading>
  }
  const sense = data[senseId]
  return <SynsetsLoader synsetIds={[sense.synset ?? ""]} />
}
