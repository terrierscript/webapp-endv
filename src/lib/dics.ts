import dictionary  from "@terrierscript/wordnet-dictionary"

export const searchLemma = (lemma: string) => {
  const result = dictionary.searchLexicalEntry(lemma)
  if (!result) {
    return null
  }

  return result
}

const searchRawSense = (senseId: string) => {
  const ids = senseId.split("-")
  const lemma = ids[1]
  const lemmaId = ids.slice(0, 3).join("-")
  const entry = dictionary.searchLexicalEntry(lemma)[lemmaId]
  const sense = entry.sense.find(s => s.id = senseId)
  return { sense, lemma }
}

export const searchExpandSense = (senseId: string) => {
  const { sense, lemma } = searchRawSense(senseId)
  console.log(sense,lemma)
  sense.senseRelation = sense.senseRelation?.map(s => {
    const { sense } = searchRawSense(s.target)
    return {
      lemma,
      ...s,
      reference: sense
    }
  }) ?? null
  return sense
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

