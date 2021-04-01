import wordnet from "en-wordnet"
import Dictionary from "en-dictionary"

let dictionary

export const getDictionary = async (): Promise<Dictionary> => {
  if (dictionary) {
    console.log("cached dictionary")
    return dictionary
  }
  console.log("initialize dictionary")
  const _dictionary = new Dictionary(wordnet.get("3.1"))
  await _dictionary.init()
  dictionary = _dictionary
  return dictionary
  // const search = "lie"
  // const result = dictionary.searchFor([search]).get(search)
  // console.log(JSON.stringify(result, null, 2))
}