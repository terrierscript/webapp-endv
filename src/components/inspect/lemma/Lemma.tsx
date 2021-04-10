import React, { FC, useEffect, useState } from "react"
import { useWordNet } from "../useWordNet"
import { Block } from "../Block"
import { LexicalEntries } from "../lexicalEntry/LexicalEntries"
import { LexicalEntryIndex } from "../../../lib/types"
import { Box, Spinner, Stack } from "@chakra-ui/react"
import nlp from "compromise"
import { InspectWordLink } from "../Link"
import { CompactLemma } from "./CompactLemma"

const patterns = (word: string) => {
  const comp = nlp(word)
  const { conjugations } = comp.verbs().json()?.[0] ?? {}
  const verbr: string[] = Object.values(conjugations ?? {})
  const noun = comp.nouns()
  const primary = [
    ...noun.toSingular().out("array"),
    conjugations?.Infinitive
  ]
  return [...new Set([
    ...primary,
    ...verbr,
  ])].filter(x => x && x.length > 0)

}
const NotFound: FC<{ word: string }> = ({ word }) => {
  const candidates = patterns(word)
  return <Box>
    <Box>😵</Box>
    <Stack>
      {candidates.map(pp => {
        return <InspectWordLink key={pp} word={pp} />
      })}
    </Stack>
  </Box>

}
type LemmaProps = {
  word: string
}

const LemmaInner: FC<LemmaProps> = ({ word }) => {
  const data = useWordNet<LexicalEntryIndex>("lemma", [word])
  const lemm = data?.[word]
  if (!data) {
    return <Spinner />
  }

  if (!lemm) {
    return <NotFound word={word} />
  }
  const ls = lemm.lexicalEntry
  return <Block >
    {ls?.map(l => {
      return <LexicalEntries key={l} lexicalEntryId={l} />
    })}
  </Block>
}


export const Lemma: FC<LemmaProps> = ({ word }) => {
  return <LemmaInner key={word} word={word} />
}