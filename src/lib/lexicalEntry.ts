import { getLexicalEntry, getSynset } from "./dictionary"
import { searchSenses } from "./searchSenses"

export const getExpandLexicalEntry = (lexId: string) => {
  const lex = getLexicalEntry(lexId)
  const senses = searchSenses(lex?.sense ?? [])
  return {
    ...senses,
    lexicalEntry: {
      ...senses.lexicalEntry,
      [lexId]: lex
    },
  }
}