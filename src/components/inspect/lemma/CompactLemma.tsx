import { FC } from "react"
import { LexicalEntryIndex } from "../../../lib/types"
import { useWordNet } from "../useWordNet"

export const CompactLemma: FC<{ word: string }> = ({ word }) => {
  const data = useWordNet<LexicalEntryIndex>("lemma", [word])

}