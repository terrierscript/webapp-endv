export const longPart = (p: string) => {
  switch (p) {
    case "n": return "Noun"
    case "v": return "Verb"
    case "a": return "Adjective"
    case "r": return "Adverb"
    case "s": return "Adjective Satellite"
    case "c": return "Conjunction"
    case "p": return "Adposition(Preposition, postposition, etc.)"
    case "x": return "Other(inc.particle, classifier, bound morphemes, determiners)"
    case "u": return "Unknown"
  }
  return "?"
}