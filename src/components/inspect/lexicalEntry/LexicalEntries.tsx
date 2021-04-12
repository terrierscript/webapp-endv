import React from "react"
import { Box, Stack } from "@chakra-ui/react"
import { Loading } from "../../Loading"
import { logPartOfSpeech } from "./longPart"
// import { SynsetsLoader } from "../synset/Synset"
import { DatasetProps } from "../useDefinitions"
import { FC } from "react"
import { SenseSynsetList } from "../synset/Synset"
import { NestedLexicaEntryData } from "../../../lib/nested/lexicaEntry"

export const LexicalEntries: FC<{ lexicalEntry: NestedLexicaEntryData }> = ({ lexicalEntry }) => {

  const lex = lexicalEntry
  if (!lex) {
    return <Loading>Loading {lexicalEntry.id}</Loading>
  }
  const { lemma, sense } = lex
  return <Box p={4}>
    {lemma?.partOfSpeech && logPartOfSpeech(lemma?.partOfSpeech)}
    <Stack>
      {sense && <SenseSynsetList senses={sense} />}
    </Stack>
  </Box>
}
