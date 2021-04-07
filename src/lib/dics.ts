import dictionary from "@terrierscript/normalized-global-wordnet-en"



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
const getSenses = (senseIds: string[]) => {
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
// const searchRawSense = (senseId: string) => {
//   const ids = senseId.split("-")
//   const lemma = ids[1]
//   const lemmaId = ids.slice(0, 3).join("-")
//   const entry = dictionary.searchLexicalEntry(lemma)[lemmaId]
//   const sense = entry.sense.find(s => s.id = senseId)
//   return { sense, lemma }
// }


const senseIdToLexId = (senseId) => {
  return senseId.replace(/\-[0-9]+\-[0-9]+/, "")
}

export const searchSenses = (senseIds: string[]) => {
  const senses = senseIds.map(senseId =>
    dictionary.getSense(senseId)
  )
  const senseEntries = senses.map(s => {
    return [s.id, s]
  })
  const senseLexicalEntryIndex = Object.fromEntries(senses.map(ss => {
    const lexId = senseIdToLexId(ss.id)
    return [ss.id, lexId]
  }))
  const lexicalEntry = Object.fromEntries(senses.map(ss => {
    const lexId = senseLexicalEntryIndex[ss.id]
    return [ss.id, dictionary.getLexicalEntry(lexId)]
  }))
  
  return {
    sense: Object.fromEntries(senseEntries),
    lexicalEntry,
    senseLexicalEntryIndex
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

const groupingRelation = (relations = []) => {
  const map = new Map()
  relations.map((rel) => {
    const { relType } = rel
    const m = map.get(relType) ?? []
    map.set(relType, [...m, rel])
  })
  return Object.fromEntries(map)
}
const getSenseRelType = (sense) => {
  const { synset, senseRelation } = sense
  console.log(sense)
  const senseSynset = dictionary.getSynset(synset)
  const { synsetRelation } = senseSynset 
  const relations = {
    sense: groupingRelation(senseRelation),
    synset: groupingRelation(synsetRelation)
  }
  return relations
}

export const getLexicalEntryRelation = (key:string) => {
  const lex = dictionary.getLexicalEntry(key)
  const senses = getSenses(lex.sense ?? [])
  const senseRelation = Object.fromEntries(
    Object.values(senses).map(sense => [sense.id, getSenseRelType(sense)])
  )
  return senseRelation

}