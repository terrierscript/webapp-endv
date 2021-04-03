import dictionary  from "@terrierscript/wordnet-dictionary"

const searchOffestsObject = (offsets: number[]) => {

  return offsets.map(offset => {
    return searchSynset(offset)
  })
  // return offsets.map(offset => {
  //   const { pointers, ...data } = searchData(offset)
  //   console.log({ pointers, ...data })
  //   return {
  //     offset,
  //     pointers
  //     ...data,
  //   }
  // })


}
export const searchLemma = (lemma: string) => {
  const result = dictionary.searchLexicalEntry(lemma)
  if (!result) {
    return null
  }
  const ent = Object.entries(result).map(([pos, entry]: any) => {
    const sense = entry.sense.map(s => {
      const synsetData = searchSynset(s.synset)
      // const relationData = synsetData.synsetRelation.map(r => {
      //   return { ...r, reference: searchSynset(r.target) }
      // })
      // const reference = {
      //   ...synsetData,
      //   synsetRelation: relationData
      // }
      return { ...s, reference: synsetData }
    })

    return { ...entry, sense }
  })

  return ent
}

const compactPointers = (pointers) => {
  const pts = Object.fromEntries(
    pointers.map(pt => {
      const { symbol, pos } = pt
      return [pt.offset, { symbol, pos }]
    })
  )
  return pts

}

export const searchSynset = (synsetId: string) => {
  const result = dictionary.searchSynset(synsetId.toString())
  return result
  // return Object.fromEntries(
  //   Object.entries(result).map(([pos, data]) => {
  //     // @ts-ignore
  //     const { words, wordCount, pointerCnt, isComment, pointers,...rest} = data
  //     return [pos,{
  //         ...rest,
  //       words,
  //       pointers: pointers
  //     }]
  //   })
  // )
}

