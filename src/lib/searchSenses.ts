import * as dictionary from "./dictionary"
import { Sense } from "./types"
import { senseIdToLexId } from "./util"

export const searchSenses = (senseIds: string[]) => {
  // @ts-ignore
  const senses : Sense[] = senseIds.map(senseId => dictionary.getSense(senseId)
  ).filter(s => s !== undefined)
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
