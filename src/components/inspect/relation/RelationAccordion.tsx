import React, { FC } from "react"
import { RelationRecord, Sense } from "../../../lib/dictionary/types"
import { ItemAccordion } from "../../ItemAcordion"
import { RelType } from "./RelType"
// import { SenseItem } from "../sense/Sense"
// import { SynsetsLoader } from "../synset/Synset"
import { DatasetProps } from "../useDefinitions"
import useSWR from "swr"
import { Loading } from "../../Loading"
import { Stack } from "@chakra-ui/react"
import { SenseRelationExpand, SynsetRelationExpand } from "../../../lib/nested/expandRelation"
import { PlainSenseOrSynset } from "../synset/PlainSenseOrSynset"

type RelLoader = { sourceId: string, relType: string }

// const RelationExpand: FC<RelLoader> = ({ sourceId, relType }) => {
// }
// const SynsetRelationLoader: FC<RelLoader> = ({ sourceId, relType }) => {
//   const { data } = useSWR<SenseRelationExpand | SynsetRelationExpand>(`/api/relations/synset/${sourceId}/${relType}`)

// }

export const RelationLoader: FC<{ type: string, sourceId: string, relType: string }> = ({ type, sourceId, relType }) => {
  const { data } = useSWR<SenseRelationExpand | SynsetRelationExpand>(`/api/relations/${type}/${sourceId}/${relType}`)

  if (!data) {
    return <Loading>Loading</Loading>
  }
  console.log(data)
  return <>{data.map((d) => <PlainSenseOrSynset key={d?.id} item={d} />)}</>
  // {
  //   // synsetIds.map((target) => {
  //   //       // const { relType } = relations
  //   //       //   .find(r => r.target === target) ?? {}
  //   //       const synset = data[target]
  //   //       const synsetLemma = lemmas?.[target] ?? []
  //   //       return <Box key={target} >
  //   //         {/* <RelType relType={relType} /> */}
  //   //         <PlainSynset
  //   //           synset={synset} lemma={synsetLemma}
  //   //         />
  //   //         {/* <SynsetItem key={target} synset={synset} synsetLemma={synsetLemma/> */}
  //   //       </Box>
  //   // })
  // }

  // return <Stack>{data.map(d => {
  //   console.log(d)
  //   return "x"
  // })}
  // </Stack>
}

export const RelationAccordion: FC<{ sourceId: string, relations: RelationRecord[] }> = ({ sourceId, relations }) => {
  // console.log(relations)
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length})</>
    } key={i} >
      <RelationLoader type={type} sourceId={sourceId} relType={relType} />
      {/* {(type === "sense")
        ? targets.map(target => {
          return <SenseItem key={target} senseId={target} />
        }) : <SynsetsLoader synsetIds={targets} />} */}
    </ItemAccordion>
  })}</>
}

// export const SynsetRelationAccordion: FC<DatasetProps & { synsetId: string }> = ({ synsetId, dataset }) => {
//   const { synsetRelations } = dataset
//   const relations = synsetRelations?.[synsetId]
//   // console.log(relations)
//   return <>{relations?.map(({ relType, targets, type }, i) => {
//     return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length})</>
//     } key={i} >
//       <SynsetsLoader synsetIds={targets} />
//     </ItemAccordion>
//   })}</>
// }

// export const SenseRelationAccordion: FC<DatasetProps & { senseId: string }> = ({ senseId, dataset }) => {
//   const { senseRelations } = dataset
//   const relations = senseRelations?.[senseId]
//   // console.log(relations)
//   return <>{relations?.map(({ relType, targets, type }, i) => {
//     return <ItemAccordion title={<><RelType relType={relType} /> ({targets.length})</>
//     } key={i} >
//       <SenseItem key={target} senseId={target}
//     </ItemAccordion>
//   })}</>
// }
