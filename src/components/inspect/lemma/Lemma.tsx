import React, { FC, useRef } from "react"
import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { CompactDefinition } from "./CompactDefinition"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"
import { RelationTab } from "./tabs/RelationTab"
import { NotFound } from "./NotFound"
import { isTruthy } from 'typesafe-utils'

export type LemmaProps = {
  word: string
  initialData: NestedLemmaData
}

// const lexicalEntryIdToLemma = (lexId: string) => {
//   return lexId.match(/ewn-(.+)-[a-z]/)?.[1] ?? ""
// }

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
  return <LemmaTab key={word} {...{ word, initialData }} />
}


const tabMap = {
  Definitions: DefinitionTab,
  Relations: RelationTab,
  Forms: FormsTab
}

const LemmaTab: FC<LemmaProps> = (props) => {
  const { word, initialData } = props
  const { data } = useNestedLemma(word, initialData)
  const formsCount = (data?.form?.length ?? 0)
  const formLemma: string[] = data?.form?.map(f => f.lemma?.writtenForm).filter(isTruthy) ?? []
  if (data && !data?.lexicalEntry) {
    return <NotFound word={word} appendCandidates={formLemma} />
  }

  return <Tabs
    // defaultIndex={1}
    // isLazy
    variant="soft-rounded"
  >
    <TabList >
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