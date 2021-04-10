import nlp from "compromise"

export const wordForms = (word: string): string[] => {
  const comp = nlp(word)
  const { conjugations } = comp.verbs().json()?.[0] ?? {}
  const verbForm: string[] = Object.values(conjugations ?? {})
  const noun = comp.nouns()
  const nounForms = noun.toSingular().out("array")
  return [...new Set([
    ...nounForms,
    ...verbForm,
  ])].filter(x => x && x.length > 0)
}
