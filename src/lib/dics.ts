import dictionary  from "@terrierscript/wordnet-dictionary"


const searchOffestsObject = (offsets: number[]) => {

  return offsets.map(offset => {
    return searchData(offset)
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
export const searchIndex = (word: string) => {
  const result = dictionary.searchIndex(word)
  if (!result) {
    return null
  }
  const ent = Object.entries(result).map(([pos, idx]) => {
    // console.log(pos,idx)
    // @ts-ignore
    const { lemma, offsets, senseCount, tagSenseCount } = idx
    const offsetData = searchOffestsObject(offsets)
    return { lemma,pos, offsetData, senseCount, tagSenseCount } 
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

export const searchData = (searchOffset: string|number) => {
  const result = dictionary.searchData(searchOffset.toString())
  return Object.fromEntries(
    Object.entries(result).map(([pos, data]) => {
      // @ts-ignore
      const { words, wordCount, pointerCnt, isComment, pointers,...rest} = data
      return [pos,{
          ...rest,
        words,
        pointers: pointers
      }]
    })
  )
}

