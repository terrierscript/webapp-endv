import nlp from "compromise"


export const filterFuzzyUnmatch = (word: string, target: string[]) => {
  const n = nlp(word)
  const collects = target.filter(l => {
    const fuzzyMatch = l.split(" ").some(ll => {
      const match = n.match(ll, { fuzzy: 0.3 })
      // console.log({ match, word, l, ll })
      // @ts-ignore
      return match.length > 0
    })
    return !fuzzyMatch
  })
  return collects
}
