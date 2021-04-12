import React, { FC } from "react"
import { RelationRecord } from "../../../lib/dictionary/types"
import { LazyLoadingAccordion } from "../../LazyLoadAccordion"
import { RelType } from "./RelType"
import useSWR from "swr"
import { Loading } from "../../Loading"
import { SenseRelationExpand, SynsetRelationExpand } from "../../../lib/nested/expandRelation"
import { PlainSenseOrSynset } from "../synset/PlainSenseOrSynset"
import { fetcher } from "../lemma/fetcher"

export const RelationLoader: FC<{ type: string, sourceId: string, relType: string }> = ({ type, sourceId, relType }) => {
  const { data } = useSWR<SenseRelationExpand | SynsetRelationExpand>(() =>
    type && sourceId && relType && `/api/relations/${type}/${sourceId}/${relType}`, fetcher, {
  })

  if (!data) {
    return <Loading>Loading</Loading>
  }
  return <>{data.map((d) => <PlainSenseOrSynset
    key={d?.id} item={d}
    more={false}
  />)}</>
}

export const RelationAccordion: FC<{ sourceId: string, relations: RelationRecord[] }> = ({ sourceId, relations }) => {
  // console.log(relations)
  return <>{relations?.map(({ relType, targets, type }, i) => {
    return <LazyLoadingAccordion title={<><RelType relType={relType} /> ({targets.length})</>
    } key={i} >
      <RelationLoader type={type} sourceId={sourceId} relType={relType} />
    </LazyLoadingAccordion>
  })}</>
}

