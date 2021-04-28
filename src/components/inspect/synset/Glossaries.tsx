import { Text, Box, Wrap } from "@chakra-ui/react"
import React, { FC, useMemo, useState } from "react"
import { SearchableText } from "./Term"
import { HighlightExample } from "./HighlightExample"

export type HighlightProps = {
  isHighlight: boolean
}
type Example = string | {
  "dc:source": string
  "#text": string
}

type GlossaryProps = {
  lemma: string[]
  definition: string[]
  example: Example[]
}

type DefinitionProps = Pick<GlossaryProps, "definition"> & HighlightProps

const Definitions: FC<DefinitionProps> = ({ definition }) => {
  return <Wrap align="center">
    {definition.map(def => <Box key={def}>
      <SearchableText as="b">{def}</SearchableText>
    </Box>)}
  </Wrap>
}

type ExampleProps = Pick<GlossaryProps, "example" | "lemma"> & HighlightProps
const Examples: FC<ExampleProps> = ({ lemma, example, isHighlight }) => {
  const examples = useMemo(() => example?.map(l => typeof l === "string" ? l : l["#text"]), [example])
  return <Wrap lineHeight="1">{
    examples.map((ex, i) => [
      i > 0 && <Text key={`sep-${i}`} as="small">/</Text>,
      <Text as="small" key={ex}>
        <HighlightExample
          isHighlight={isHighlight}
          sentence={ex} words={lemma}
        />
      </Text>]
    )
  }
  </Wrap>
}

export const Glossaries = ({ lemma, definition, example }: GlossaryProps) => {
  const [isActive, setActive] = useState(false)

  return <Box p={2} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
    {definition && <Definitions isHighlight={isActive} definition={definition} />}
    {example && <Examples isHighlight={isActive} lemma={lemma} example={example} />}
  </Box>
}
