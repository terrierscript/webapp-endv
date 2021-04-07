import dictionary from "@terrierscript/normalized-global-wordnet-en"
import { LexicalEntry, Sense, Synset, LexicalEntryIndex, Behavior } from "./types"

export const getLexicalEntry = (id: string): LexicalEntry | undefined => dictionary.getLexicalEntry(id)
export const getSense = (id: string): Sense | undefined=> dictionary.getSense(id)
export const getSynset = (id: string): Synset | undefined=> dictionary.getSynset(id)
export const getLemma = (id: string): LexicalEntryIndex | undefined=> dictionary.getLemma(id)
export const getSynsetIndex = (id: string): LexicalEntryIndex | undefined=> dictionary.getSynsetIndex(id)
export const getSyntacticBehaviour = (id: string): Behavior | undefined=> dictionary.getSyntacticBehaviour(id)
