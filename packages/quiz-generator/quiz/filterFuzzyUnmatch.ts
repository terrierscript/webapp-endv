import nlp from "compromise"
import { isTruthy } from "typesafe-utils"


export const filterFuzzyUnmatch = (word: string, target: string[]) => {
  const n = nlp(word)
  const collects = target.filter(l => {
    const fuzzyMatch = l.split(" ").some(ll => {
      // const match = n.match(`~${ll}~`, null, { fuzzy: 0.3 })
      const match = n.match(ll, { fuzzy: 0.3 })
      // console.log({ match, word, l, ll })
      // @ts-ignore
      return match.length > 0
    })
    return !fuzzyMatch
  })
  return collects
}

export function* filterFuzzyUnmatchGenerator(word: string, target: string[]) {
  const n = nlp(word)

  for (let i = 0;i < target.length;i++) {
    const l = target[i]
    // console.log(i, target[i])
    const fuzzyMatch = l.split(" ").some(ll => {
      const match = n.match(ll, { fuzzy: 0.3 })

      // console.log({ match, word, l, ll })
      // @ts-ignore
      return match.length > 0
    })
    if (!fuzzyMatch) {
      yield l
    }
  }
}

const g = filterFuzzyUnmatchGenerator("a", ["cc"])


export const filterFuzzyUnmatchNum = (word: string, target: string[], num: number): string[] => {
  const generator = filterFuzzyUnmatchGenerator(word, target)
  return [...Array(num)]
    .map((): string | null => {
      const r = generator.next()
      if (typeof r.value === "string") {
        return r.value
      }
      return null
    })
    .filter(isTruthy)
}
