import React from "react"
import { SynsetsLoader } from "../synset/Synset"
import { Sense } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"
import { useWordNetQuery } from "../useWordNet"

/** @deprecated */
export const SenseItem = ({ senseId }: { senseId: string }) => {
  const data = useWordNetQuery<Sense>("sense", [senseId])
  if (!data) {
    return <Loading>Loading sense..</Loading>
  }
  const sense = data[senseId]
  return <SynsetsLoader synsetIds={[sense.synset ?? ""]} />
}
