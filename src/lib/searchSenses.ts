import * as dictionary from "./dictionary"
import { senseIdToLexId } from "./util"

export const searchSenses = (senseIds: string[]) => {
  const senses = senseIds.map(senseId => dictionary.getSense(senseId)
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

    return [lexId, dictionary.getLexicalEntry(lexId)]
  }))

  return {
    sense: Object.fromEntries(senseEntries),
    lexicalEntry,
    senseLexicalEntryIndex
  }
}
