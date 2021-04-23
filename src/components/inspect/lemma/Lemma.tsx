import React, { FC, useRef } from "react"
import { Box, Button, HStack, Link, Stack, Wrap } from "@chakra-ui/react"
import { CompactDefinition } from "./CompactDefinition"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { useNestedLemma } from "./useNestedLemma"
import { RelationTab } from "./tabs/RelationTab"
import { isTruthy } from 'typesafe-utils'
import { InspectWordLink } from "../../Link"
import { LemmaTab } from "./LemmaTab"

export type LemmaProps = {
  word: string
  initialData: NestedLemmaData
}

// const lexicalEntryIdToLemma = (lexId: string) => {
//   return lexId.match(/ewn-(.+)-[a-z]/)?.[1] ?? ""
// }

export const DefinitionTab: FC<LemmaProps> = ({ word, initialData }) => {
  return <CompactDefinition word={word} initialData={initialData} definitionNum={Infinity} />
}
export const FormsTab: FC<LemmaProps> = ({ word, initialData }) => {
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
    <Button as="a" href={`https://www.google.com/search?tbm=isch&cr=countryUS&lr=lang_en&q=${encodeURIComponent(`${word} image`)}`} target="_blank">
      Google Image
      </Button>
  </Box>
  <Box>
    <Button as="a" href={`https://en-word.net/lemma/${word}`} target="_blank">
      en-word.net
      </Button>
  </Box>
  <Box>
    <Button as="a" href={`https://www.dictionary.com/browse/${word}`} target="_blank">
      dictionary.com
      </Button>
  </Box>
</Wrap>

export const Lemma: FC<LemmaProps> = ({ word, initialData }) => {
  return <Stack>
    <LemmaTab key={word} {...{ word, initialData }} />
    <Externals word={word} />

  </Stack>
}


const tabMap = {
  Definitions: DefinitionTab,
  Relations: RelationTab,
  Forms: FormsTab
}

