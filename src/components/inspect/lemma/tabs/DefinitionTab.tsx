import { Box, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react"
import React, { FC, useMemo, useState } from "react"
import { Loading } from "../../../Loading"
import { Words } from "../../synset/Words"
import { NestedLemmaData } from "../../../../lib/nested/lemma"
import { useNestedLemma } from "../useNestedLemma"
import { isTruthy } from 'typesafe-utils'
import { SearchableText } from "../../synset/Term"

export const CompactSynonymus: FC<{ word: string, initialData?: NestedLemmaData }> = ({ word, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  const synonymus: string[] = useMemo(() => {
    const allSynsets = data?.lexicalEntry?.map(lex => lex.senses?.map(s => {
      return s?.synset
    })).flat()
    const syns = allSynsets?.map(s => s?.lemmas).flat()
    return [
      ...new Set(syns)
    ]
      .filter(w => w !== word)
      .filter(isTruthy)
  }, [JSON.stringify(data)])
  if (synonymus.length === 0) {
    return null
  }
  return <Box>
    <Heading size="sm">Synonymus</Heading>
    <Words words={synonymus ?? []} />
  </Box>

}

const Def: FC<{ def: string }> = ({ def }) => {
  const [searchable, setSearchable] = useState(false)
  return <Box
    onClick={() => { setSearchable(true) }}
    onMouseOver={() => { setSearchable(true) }}
  >
    {searchable ?
      <SearchableText>{def}</SearchableText> : def
    }
  </Box>
}

export const DefinitionTab: FC<{ word: string, initialData?: NestedLemmaData }> = ({ word, initialData }) => {
  const { data } = useNestedLemma(word, initialData)
  const definitions = useMemo(() => {
    return data?.lexicalEntry?.map(lex => lex.senses?.map(s => {
      return s?.synset
    })).flat()
      .map(s => s?.definition.join(" / ")).flat()
  }, [JSON.stringify(data)])

  if (!data) {
    return <Loading>Loading</Loading>
  }
  if (!definitions) {
    return <Box>Not found</Box>
  }

  return <Stack p={2}>
    <Box>
      <Heading size="sm">Definitions</Heading>
      <UnorderedList>
        {definitions?.map(def => {
          return def && <ListItem key={def}><Def def={def} /></ListItem>
        })}
      </UnorderedList>

    </Box>
    <CompactSynonymus {...{ word, initialData }} />
  </Stack>
}

