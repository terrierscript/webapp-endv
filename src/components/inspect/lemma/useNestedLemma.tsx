import useSWR from "swr"
import { NestedLemmaData } from "../../../lib/nested/lemma"
import { fetcher } from "./fetcher"

export const useNestedLemma = (word: string, initialData?: NestedLemmaData) => {
  return useSWR<NestedLemmaData>(() => {
    return word && `/api/dictionary/lemma/${word}`
  }, fetcher, {
    initialData
  })
}
