import React, { FC, useEffect, useState } from "react"
import { useWordNet, useWordNetQuery } from "../useWordNet"
import { Block } from "../Block"
import { LexicalEntries } from "../lexicalEntry/LexicalEntries"
import { LexicalEntryIndex } from "../../../lib/dictionary/types"
import { Box, Heading, Spinner, Stack } from "@chakra-ui/react"
import nlp from "compromise"
import { InspectWordLink } from "../Link"
import { CompactDefinition } from "./CompactDefinition"
import { Loading } from "../../Loading"

type LemmaProps = {
  word: string
}

const patterns = (word: string, appendCandidates: string[]) => {
  const comp = nlp(word)
  const { conjugations } = comp.verbs().json()?.[0] ?? {}
  const verbForm: string[] = Object.values(conjugations ?? {})
  const noun = comp.nouns()
  const primary = [
    ...appendCandidates,
    ...noun.toSingular().out("array"),
    conjugations?.Infinitive
  ]
  return [...new Set([
    ...primary,
    ...verbForm,
  ])].filter(x => x && x.length > 0)

}
const NotFound: FC<LemmaProps & { appendCandidates?: string[] }> = ({ word, appendCandidates = [] }) => {
  const candidates = patterns(word, appendCandidates)
  return <Box>
    <Box>😵</Box>
    <Stack>
      {candidates.map(pp => {
        return <InspectWordLink key={pp} word={pp} />
      })}
    </Stack>
  </Box>

}

const lexicalEntryIdToLemma = (lexId: string) => {
  return lexId.match(/ewn-(.+)-[a-z]/)?.[1] ?? ""
}

const LemmaInner: FC<LemmaProps> = ({ word }) => {
  const data = useWordNetQuery<LexicalEntryIndex>("lemma", [word])
  const lemm = data?.[word]
  const formLemma = lemm?.form?.map(f => lexicalEntryIdToLemma(f)) ?? []

  if (!data) {
    return <Loading>
      Loading Word...
    </Loading>
  }
  const ls = lemm?.lexicalEntry

  if (!ls) {
    return <NotFound word={word} appendCandidates={formLemma} />
  }

  return <Stack>
    <CompactDefinition word={word} />
    {ls?.map(l => {
      return <LexicalEntries key={l} lexicalEntryId={l} />
    })}
    {lemm?.form?.join("/")}
  </Stack>
}

export const Lemma: FC<LemmaProps> = ({ word }) => {
  return <LemmaInner key={word} word={word} />
}