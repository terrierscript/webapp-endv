import React, { FC, useEffect, useState } from "react"
import { useWordNetQuery } from "../useWordNet"
import { Block } from "../Block"
import { LexicalEntries } from "../lexicalEntry/LexicalEntries"
import { LemmaIndex } from "../../../lib/dictionary/types"
import { Box, Heading, Spinner, Stack } from "@chakra-ui/react"
import nlp from "compromise"
import { InspectWordLink } from "../Link"
import { CompactDefinition } from "./CompactDefinition"
import { Loading } from "../../Loading"
import { useWordNetPartials } from "../useDefinitions"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"

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

const useLemma = (word: string) => {
  return useSWR<NestedLemmaData>(`/api/dictionary/lemma${word}`)
}
const LemmaInner: FC<LemmaProps> = ({ word }) => {
  const { data } = useLemma(word)

  if (!data) {
    return <Loading>
      Loading Word...
    </Loading>
  }
  const lexs = data?.lexicalEntry
  // @ts-ignore
  const formLemma: string[] = data?.form?.map(f => f.lemma?.writtenForm)
  if (!lexs) {
    return <NotFound word={word} appendCandidates={formLemma} />
  }

  return <Stack>
    {/* <CompactDefinition word={word} /> */}
    {lexs?.map(l => {
      return <LexicalEntries key={l.id} lexicalEntry={l} />
    })}
    {data?.form?.join("/")}
  </Stack>
}

export const Lemma: FC<LemmaProps> = ({ word }) => {
  return <LemmaInner key={word} word={word} />
}