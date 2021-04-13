import React, { FC } from "react"
import { LexicalEntries } from "../../lexicalEntry/LexicalEntries"
import { Stack } from "@chakra-ui/react"
import { Loading } from "../../../Loading"
import { useNestedLemma } from "../useNestedLemma"
import { LemmaProps, NotFound } from "../Lemma"

const RelationTab: FC<LemmaProps> = ({ word, initialData }) => {
  const { data } = useNestedLemma(word, initialData)

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
    {lexs?.map(l => {
      return <LexicalEntries key={l.id} lexicalEntry={l} />
    })}
    {data?.form?.join("/")}
  </Stack>
}
