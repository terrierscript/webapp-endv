import { generateDictionary } from "@terrierscript/normalized-global-wordnet-en"

const dictionary = generateDictionary(
  {
    loader: (dirname, dig) => {
      return require(`../../../node_modules/@terrierscript/normalized-global-wordnet-en/dic/${dirname}/${dig}.json`)

    }
  }
)
export default dictionary