import * as dictionary from "./dictionary"



// const searchLemma = (lemma: string) => {
//   const { lexicalEntry } = dictionary.getLemma(lemma)
//   const lexs = lexicalEntry.map(l => dictionary.getLexicalEntry(l))
//   if (!lexs) {
//     return null
//   }
//   return lexs
// }

// const getSenseSynsets = (synsetIds:string[]) => {
//   // @ts-ignore
//   // return Object.fromEntries(
//   //   synsetIds.map(id => [id, dictionary.getSynset(id)])
//   // )
//   const norms = searchSynsets(synsets)
//   // return norms
// }
export const getSenses = (senseIds: string[]) => {
  return Object.fromEntries(senseIds.map(id => {
    return [id, dictionary.getSense(id)]
  }))
}
const getSynsets = (synsetId: string[]) => {
  return Object.fromEntries(synsetId.map(id => {
    return [id, dictionary.getSynset(id)]
  }))
}


export const searchWords = (lemmas: string[]) => {
  const lemmaEntry = lemmas.map(l => [l, dictionary.getLemma(l)])
  console.log(lemmaEntry.map(l => l[1].lexicalEntry).flat())
  
  const lexEntries = lemmaEntry.map(l => l[1].lexicalEntry).flat()
    .map(w => [w, dictionary.getLexicalEntry(w)])
  
  const senseIds = lexEntries.map(([_, lex]) => lex).flat().map(lex => {
    return lex.sense
  }).flat()
  const sense = getSenses(senseIds)
  const synsetIds = Object.values(sense).map(s => s.synset)
  const synsetResult = searchSynsets(synsetIds)
  return {
    ...synsetResult,
    lemma: Object.fromEntries(lemmaEntry),
    lexicalEntry: Object.fromEntries(lexEntries),
    sense,
  }
}


export const getSynsetLexicalEntry = (synsetId: string) => {
  const synIdx = dictionary.getSynsetIndex(synsetId)
  return {
    id: synsetId,
    ...synIdx,
  }

}
export const getSynsetLemma = (synsetId: string) => {
  const { lexicalEntry } = dictionary.getSynsetIndex(synsetId)
  const lexs = lexicalEntry.map(l => dictionary.getLexicalEntry(l))
  return {
    id: synsetId,
    lemma: lexs.map(l => l.lemma.writtenForm)
  }
}
export const searchRelatedSenses = (senseIds: string[]) => {
  const senses = senseIds.map(senseId =>
    dictionary.getSense(senseId)
  )
  const relationalSenseEntries = senses.map(s => {
    return s.senseRelation
  })
    .flat()
    .map(ss => {
      return [ss.target, dictionary.getSense(ss.target)]
    })
  return { sense: Object.fromEntries(relationalSenseEntries) }
}


export const searchSynsets = (synsetIds: string[]) => {
  const synset = Object.fromEntries(synsetIds.map(s => [s, dictionary.getSynset(s)]))

  const synsetLexMap = Object.fromEntries(synsetIds.map(s => {
    const lexId = dictionary.getSynsetIndex(s).lexicalEntry
    return [s, lexId]
  }))
  
  const lexicalEntry = Object.fromEntries(
    Object.values(synsetLexMap).flat().map(l => [l, dictionary.getLexicalEntry(l)])
  )
  const synsetLemma = Object.fromEntries(Object.entries(synsetLexMap).map(([k, v]) => {
    return [k, v.map(vv => lexicalEntry[vv].lemma.writtenForm)]
  }))

  return {
    synset,
    synsetLemma,
    lexicalEntry,
  }
}

