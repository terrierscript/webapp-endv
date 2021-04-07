// @ts-ignore
import dictionary from "@terrierscript/normalized-global-wordnet-en"
import { LexicalEntry, Sense, Synset, LexicalEntryIndex, Behavior } from "./types"

export const getLexicalEntry = (id: string|undefined): LexicalEntry | undefined => id && dictionary.getLexicalEntry(id)
export const getSense = (id: string | undefined): Sense | undefined => id && dictionary.getSense(id)
export const getSynset = (id: string | undefined): Synset | undefined => id && dictionary.getSynset(id)
export const getLemma = (id: string | undefined): LexicalEntryIndex | undefined => id &&  dictionary.getLemma(id)
export const getSynsetIndex = (id: string | undefined): LexicalEntryIndex | undefined => id && dictionary.getSynsetIndex(id)
export const getSyntacticBehaviour = (id: string | undefined): Behavior | undefined => id &&  dictionary.getSyntacticBehaviour(id)
