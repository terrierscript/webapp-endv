import React, { useMemo } from "react"
import { SenseItem } from "../sense/Sense"
import { useWordNet, useWordNetQuery } from "../useWordNet"
import { Box, Stack } from "@chakra-ui/react"
import { LexicalEntry, Sense } from "../../../lib/dictionary/types"
import { Loading } from "../../Loading"
import { logPartOfSpeech } from "./longPart"
import { SynsetsLoader } from "../synset/Synset"
import { DatasetProps } from "../useDefinitions"
import { FC } from "react"

export const LexicalEntries: FC<DatasetProps & { lexicalEntryId: string }> = ({ lexicalEntryId, dataset }) => {
  // const lexs = useWordNetQuery<LexicalEntry>("lexicalEntry", [lexicalEntryId])
  // const senseMap = useWordNetQuery<Sense>("sense", () => lexs && Object
  //   .values(lexs)
  //   .map(l => l?.sense).flat()
  //   .filter((l): l is string => !!l)
  // )

  // const synsetIds = useMemo(() => senseMap ? Object.values(senseMap)
  //   .map(s => s.synset)
  //   .filter((s): s is string => !!s) : [], [JSON.stringify(senseMap)])
  // console.log("xx", senseMap, synsetIds)
  // if (!lexs || !senseMap || !synsetIds) {
  //   return <Loading>Loading {lexicalEntryId}</Loading>
  // }

  const lex = dataset?.lexicalEntry?.[lexicalEntryId]
  const synsetIds = dataset?.synsetIds
  if (!lex) {
    return <Loading>Loading {lexicalEntryId}</Loading>
  }
  const { lemma, sense } = lex
  return <Box p={4}>
    {logPartOfSpeech(lemma.partOfSpeech)}
    <Stack>
      {/* <SynsetsLoader synsetIds={synsetIds} /> */}
      {/* {sense?.map(s => {
        return <SenseItem key={s} senseId={s} />
      })} */}
    </Stack>
  </Box>
}
