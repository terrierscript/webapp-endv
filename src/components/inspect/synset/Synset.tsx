import { Box, Stack } from "@chakra-ui/react"
import React, { FC } from "react"
import { Glossaries } from "./Glossaries"
import { Words } from "./Words"
import { NestedSenseData } from "../../../lib/nested/sense"
import { NestedSynsetData } from "../../../lib/nested/synset"
import { PlainSenseOrSynset } from "./PlainSenseOrSynset"


export const PlainSynset: FC<{ synset: NestedSynsetData }> = ({ synset }) => {
  if (!synset) {
    return null
  }
  const lemma = synset?.lemma
  const { definition, example } = synset ?? {}

  return <Box id={`sysnet-${synset.id}`} boxShadow="xs" rounded={"xs"} p={2} m={2}>
    <Words words={lemma} />
    <Glossaries {...{ lemma, definition, example }} />
  </Box>
}

export const SenseSynsetList: FC<{ senses: NestedSenseData[] }> = ({ senses }) => {
  return <Stack spacing={4}>
    {senses.map(s => {
      return s && <PlainSenseOrSynset key={s.id} item={s} />
    })}
  </Stack>
}
