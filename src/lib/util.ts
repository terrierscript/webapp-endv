// const searchRawSense = (senseId: string) => {
//   const ids = senseId.split("-")
//   const lemma = ids[1]
//   const lemmaId = ids.slice(0, 3).join("-")
//   const entry = dictionary.searchLexicalEntry(lemma)[lemmaId]
//   const sense = entry.sense.find(s => s.id = senseId)
//   return { sense, lemma }
// }
export const senseIdToLexId = (senseId) => {
  return senseId.replace(/\-[0-9]+\-[0-9]+/, "")
}
