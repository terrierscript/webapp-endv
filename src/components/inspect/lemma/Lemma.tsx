import React, { FC, useRef } from "react"
import { Box, Button, HStack, Link, Stack, Wrap } from "@chakra-ui/react"
import { CompactDefinition } from "./CompactDefinition"
import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { RelationTab } from "./tabs/RelationTab"
import { LemmaTab } from "./LemmaTab"

export type LemmaProps = {
  word: string
  initialData: NestedLemmaData
}

const Externals: FC<{ word: string }> = ({ word }) => <Wrap>
  <Box>
    <Button as="a" href={`https://www.google.com/search?nfpr=1&tbm=isch&cr=countryUS&lr=lang_en&q=${encodeURIComponent(`${word} OR "${word} image" OR "${word} meaning"`)}`} target="_blank">
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

