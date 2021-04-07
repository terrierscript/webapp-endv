// import dictionary from "@terrierscript/normalized-global-wordnet-en"


// const senseIdToLexId = (senseId) => {
//   return senseId.replace(/\-[0-9]+\-[0-9]+/, "")
// }

// const _getSynset = (synsetId: string) => {
//   const synset = dictionary.getSynset(synsetId)
//   const synsetIndexes = dictionary.getSynset(synsetId)
//   console.log(synsetIndexes)
//   return {
//     ...synset
//   }
// }
// const _getSense = (sense: string) => {
//   const {synset, ...rest} = dictionary.getSense(sense)
//   return {
//     ...rest,
//     synset: _getSynset(synset)
//   }
// }
// const _getLexicalEntry = (lexId: string) => {
//   const { sense, ...rest } = dictionary.getLexicalEntry(lexId)
//   const senseExpand = getSenses(sense)

//   return {
//     ...rest,
//     sense: senseExpand
//   }
// }

// const getSenses = (senseIds: string[]) => senseIds.map(s => _getSense(s))
// const getSynsets = (synsetIds: string[]) => synsetIds.map(s => dictionary.getSynset(s))
// const getLexicalEntries = (lexIds: string[]) => lexIds.map(w => _getLexicalEntry(w))
// const getSynsetIndexes = (synsetIds: string[]) => synsetIds.map(s => ({
//   id: s,
//   lemma: dictionary.getSynsetIndex(s).lexicalEntry
// }))

// export const searchWord = (lemma: string) => {
//   const lemmaResult = dictionary.getLemma(lemma)
//   if (!lemmaResult) {
//     return null
//   }

//   const lexicalEntries = getLexicalEntries(lemmaResult.lexicalEntry)
//   // const senseIds = lexicalEntries
//   //   .map(lex => lex.sense)
//   //   .filter(s => !!s)
//   //   .flat()
//   // const sense = getSenses(senseIds)
//   // const synsetIds = sense.map(s => s.synset).filter(s => !!s)
//   // const sysnet = getSynsets(synsetIds)
//   // const synsetLexicalEntries = getSynsetIndexes(synsetIds)
//   // const l = synsetLexicalEntries.map(s => s.lemma)
//   // console.log(sysnetId)
//   // const n = dictionary.getSynset(sense)
//   return {
//     lexicalEntries
//     // lemma: { [lemma]: lemmaResult },
//     // lexicalEntries: toIdObj(lexicalEntries),
//     // sense: toIdObj(sense),
//     // sysnet: toIdObj(sysnet),
//     // synsetLexicalEntries: lex
//   }
// }