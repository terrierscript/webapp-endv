import { Text, HStack, Box, Stack, Spinner } from "@chakra-ui/react"
import React, { FC } from "react"
import { Glossaries } from "./Glossaries"
import { useWordNetQuery } from "../useWordNet"
import { BBlock } from "../Block"
import { InspectWordLink } from "../Link"
import { Relation, Sense, Synset, SynsetLemma } from "../../../lib/dictionary/types"
import { RelType } from "../relation/RelType"
import { LoadSenseRelation, LoadSynsetRelation } from "../relation/RelationLoader"
import { Words } from "./Words"
import { ItemAccordion } from "../../ItemAcordion"

const PlainSynset: FC<{ sense?: Sense, synset: Synset, lemma: string[] }> = ({ sense, synset, lemma = [] }) => {
  const { definition, example } = synset ?? {}

  return <BBlock id={`sysnet-${synset.id}`}>
    {/* sense {sense?.id ?? "-"} synset: {synset.id} */}
    <Words words={lemma} />
    <Glossaries lemma={lemma} definition={definition} example={example} />
    <ItemAccordion title="more">
      {synset && <LoadSynsetRelation synsetId={synset.id} />}
      {sense && <LoadSenseRelation sense={sense} />}
    </ItemAccordion>
  </BBlock>
}

const SynsetItem: FC<{ synset: Synset }> = ({ synset }) => {
  // console.log(synset)
  const lemmas = useWordNetQuery<SynsetLemma>("synsetLemma", [synset?.id])
  const synsetLemma = lemmas?.[synset.id] ?? []

  return <PlainSynset
    synset={synset} lemma={synsetLemma}
  />

}
export const SynsetsLoader: FC<{ synsetIds?: string[], relations?: Relation[] }> = ({ synsetIds = [], relations = [] }) => {
  const data = useWordNetQuery<Synset>("synset", synsetIds)
  // const lemmas = useWordNet<SynsetLemma>("synsetLemma", synsetIds)

  if (!data) {
    return <Box p={4} verticalAlign="center">
      <Spinner /><Text> Loading Synset</Text>
    </Box>
  }
  return <Stack>
    {synsetIds.map((target) => {
      // const { relType } = relations
      //   .find(r => r.target === target) ?? {}
      // console.log("rel", relType)
      const synset = data[target]
      // const synsetLemma = lemmas?.[target] ?? []
      return <Box key={target} >
        {/* <RelType relType={relType} /> */}
        <SynsetItem key={target} synset={synset} />
      </Box>
    })}
  </Stack>
}
