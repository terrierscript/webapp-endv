import React, { FC } from "react"
import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import nlp from "compromise"
import { InspectWordLink } from "../Link"
import { CompactDefinition } from "./CompactDefinition"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"

export type LemmaProps = {
  word: string
  initialData: NestedLemmaData
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
export const NotFound: FC<{ word: string, appendCandidates?: string[] }> = ({ word, appendCandidates = [] }) => {
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
  const { data } = useSWR(() => "aa", {})

  return
}
const DefinitionTab: FC<LemmaProps> = ({ word, initialData }) => {
  return <CompactDefinition word={word} initialData={initialData} definitionNum={Infinity} />
}
const FormsTab: FC<LemmaProps> = ({ word, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  if (!data?.form) {
    return <Box>No forms</Box>
  }
  return <Stack>
    {data?.form?.map(f => <Box>{f}</Box>)}
  </Stack>
}


export const Lemma: FC<LemmaProps> = ({ word, initialData }) => {
  return <LemmaInner key={word} word={word} initialData={initialData} />
}

const LemmaInner: FC<LemmaProps> = (props) => {
  const { word, initialData } = props
  const { data } = useNestedLemma(word, initialData)
  const formsCount = (data?.form?.length ?? 0)
  return <Tabs
    defaultIndex={1}
    isLazy
  // variant="soft-rounded"

  >
    <TabList>
      <Tab>Definitions</Tab>
      <Tab>Relations</Tab>
      <Tab>Forms ({formsCount})</Tab>
    </TabList>
    <TabPanels >
      <TabPanel>
        <DefinitionTab {...props} />
      </TabPanel>
      <TabPanel >
        <RelationTab {...props} />
      </TabPanel>
      <TabPanel >
        <FormsTab {...props} />
      </TabPanel>
    </TabPanels>
  </Tabs>
}