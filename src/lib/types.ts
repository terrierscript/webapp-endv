export type Mapping<T> = {
  [key in string]: T
}

export type EntityType =
  "lexicalEntry" |
  "lexicalEntryRelation"|
  "lemma" |
  "synset" |
  "synsetIndex" |
  "synsetLemma" |
  "synsetLexicalEntry" |
  // "senseRelated"|
  "syntacticBehaviour" |
  "sense" |
  "senseRelation" |
  "synsetRelation"

export type LexicalEntry = {
  id: string
  lemma: {
    partOfSpeech: string
    writtenForm: string
  }
  sense?: string[]
}
export type Relation = {
  relType: string
  target: string
}
export type Sense = {
  id: string
  synset: string
  "dc:identifier": string
  senseRelation?: Relation[]
}
export type Synset = {
  id: string
  ili: string
  partOfSpeech: string
  "dc:subject": string
  synsetRelation?: Relation[]
  definition: string[]
  example: string[]
}
export type LexicalEntryIndex = {
  lexicalEntry: string[]
}
export type Behavior = string[]

export type SynsetLemma = string[]
// {
//   id: string,
//   lemma: string[]
// }


export type RelationMap = { [key in string]: string[] }
export type SenseRelation = {
  sense: RelationMap
  synset: RelationMap
}
export type RelationRecord = {
  relType: string,
  targets: string[]
  type: "sense" | "synset"
}