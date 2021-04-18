import React, { FC, useRef } from "react"
import { Box, Button, HStack, Link, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Wrap } from "@chakra-ui/react"
import { CompactDefinition } from "./CompactDefinition"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"
import { RelationTab } from "./tabs/RelationTab"
import { NotFound } from "./NotFound"
import { isTruthy } from 'typesafe-utils'
import { InspectWordLink, QuizLink } from "../../Link"

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
  const forms = data.form?.map(f => f.lemma?.writtenForm)
    .filter(f => !!f)
    .filter(isTruthy)

  return <Stack>
    {forms?.map(f => <Box key={f}>
      <InspectWordLink word={f} />
    </Box>)}
  </Stack>
}

const Externals: FC<{ word: string }> = ({ word }) => <Wrap>
  <Box>
    <Link href={`https://www.google.com/search?tbm=isch&cr=countryUS&lr=lang_en&q=${encodeURIComponent(`${word} image`)}`} target="_blank">
      <Button>
        Google Image
          </Button>
    </Link>
  </Box>
  <Box>
    <Link href={`https://en-word.net/lemma/${word}`} target="_blank">
      <Button>
        en-word.net
      </Button>
    </Link>
  </Box>
  <Box>
    <Link href={`https://www.dictionary.com/browse/${word}`} target="_blank">
      <Button>
        dictionary.com
      </Button>
    </Link>
  </Box>
</Wrap>

export const Lemma: FC<LemmaProps> = ({ word, initialData }) => {
  return <Stack>
    <LemmaTab key={word} {...{ word, initialData }} />
    <Stack>
      <Box>
        <QuizLink word={word}>
          <Button colorScheme="teal">Start Quiz</Button>
        </QuizLink>
      </Box>
    </Stack>
    <Externals word={word} />

  </Stack>
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