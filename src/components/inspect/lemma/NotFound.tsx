import React, { FC, useMemo } from "react"
import { Box, Stack } from "@chakra-ui/react"
import nlp from "compromise"
import { InspectWordLink } from "../Link"

const patterns = (word: string) => {
  const comp = nlp(word)
  const { conjugations } = comp.verbs().json()?.[0] ?? {}
  const verbForms: string[] = Object.values(conjugations ?? {})
  const noun = comp.nouns()
  return [
    ...noun.toSingular().out("array"),
    conjugations?.Infinitive,
    ...verbForms
  ]

}
export const NotFound: FC<{ word: string; appendCandidates?: string[] }> = ({ word, appendCandidates = [] }) => {
  const candidates = useMemo(() => {
    const splits = word.split(" ")
    const splitsCandidate = splits.length > 1 ? splits.map(w => patterns(w)).flat() : []
    return [...new Set([
      ...appendCandidates,
      ...patterns(word),
      ...splitsCandidate.flat()
    ])].filter(x => x && x.length > 0)
  }, [word])
  console.log(candidates)
  return <Box>
    <Box>😵</Box>
    <Stack>
      {candidates.map(pp => {
        return <InspectWordLink key={pp} word={pp} />
      })}
    </Stack>
  </Box>
}
