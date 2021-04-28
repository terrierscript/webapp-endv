import React, { FC } from "react"
import { Box, Stack } from "@chakra-ui/react"
import { useNestedLemma } from "../useNestedLemma"
import { isTruthy } from 'typesafe-utils'
import { InspectWordLink } from "../../../Link"
import { LemmaProps } from "../Lemma"

// const lexicalEntryIdToLemma = (lexId: string) => {
//   return lexId.match(/ewn-(.+)-[a-z]/)?.[1] ?? ""
// }

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
