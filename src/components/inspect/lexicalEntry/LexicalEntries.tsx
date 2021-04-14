import React from "react"
import { Box, Stack } from "@chakra-ui/react"
import { Loading } from "../../Loading"
import { logPartOfSpeech } from "./longPart"
// import { SynsetsLoader } from "../synset/Synset"
import { FC } from "react"
import { SenseSynsetList } from "../synset/Synset"
import { NestedLexicaEntryData } from "../../../lib/nested/lexicaEntry"

export const LexicalEntries: FC<{ lexicalEntry: NestedLexicaEntryData }> = ({ lexicalEntry }) => {

  const lex = lexicalEntry
  if (!lex) {
    return <Loading>Loading {lexicalEntry.id}</Loading>
  }
  const { lemma, senses } = lex
  return <Box p={4}>
    {lemma?.partOfSpeech && logPartOfSpeech(lemma?.partOfSpeech)}
    <Stack>
      {senses && <SenseSynsetList senses={senses} />}
    </Stack>
  </Box>
}
