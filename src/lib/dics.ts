import dictionary from "@terrierscript/normalized-global-wordnet-en"

const searchLemma = (lemma: string) => {
  const { lexicalEntry } = dictionary.getLemma(lemma)
  const lexs = lexicalEntry.map(l => dictionary.getLexicalEntry(l))
  if (!lexs) {
    return null
  }
  return lexs
}

export const searchWords = (lemmas: string[]) => {
  const lexEntries = lemmas.map(w => [w, searchLemma(w)])
  const senseIds = lexEntries.map(([_, lex]) => lex).flat().map(lex => {
    return lex.sense
  }).flat()
  const sense = getSenses(senseIds)

  return { lemma: Object.fromEntries(lexEntries), sense }
}

const getSenses = (senseIds: string[]) => {
  return Object.fromEntries(senseIds.map(id => {
    return [id, dictionary.getSense(id)]
  }))
}

const searchRawSense = (senseId: string) => {
  const ids = senseId.split("-")
  const lemma = ids[1]
  const lemmaId = ids.slice(0, 3).join("-")
  const entry = dictionary.searchLexicalEntry(lemma)[lemmaId]
  const sense = entry.sense.find(s => s.id = senseId)
  return { sense, lemma }
}

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
  const lexicalEntry = Object.fromEntries(senses.map(ss => {
    const lexId = senseIdToLexId(ss.id)
    return [ss.id, dictionary.getLexicalEntry(lexId)]
  }))
  return {
    sense: Object.fromEntries(senseEntries),
    lexicalEntry
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
  console.log(synsetLexMap)
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

