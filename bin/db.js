const md5 = require("md5")
const fs = require("fs")
const wordnet = require( "en-wordnet").default
const Dictionary = require( "en-dictionary").default


const w2dg = (l) => {
  const digest = md5(l)
  const k = digest.slice(0,2)
  return k
}
const keysToSplitData = (dir, maps) => {
  fs.mkdirSync(dir, {recursive:true})
  const keys = Array.from( maps.keys())
  let digests = {}
  keys.map(l => {
    const dig =w2dg(l) 
    const v = digests[dig] ?? [] 
    digests[dig] =[...v, l] 
  })
  Object.entries(digests).map(([dig, keys]) => {
    const items = keys.map(key => {
      const item = maps.get(key)
      return item
    })
    fs.writeFileSync(`${dir}/${dig}.json`, JSON.stringify(items,null,2))
  })
}

// data -> offset
// index -> lemma

const start = async () => {
  const dictionary = new Dictionary(wordnet.get("3.1"))
  await dictionary.init()
  keysToSplitData(`dic/data`,  dictionary.database.dataOffsetIndex)
  keysToSplitData(`dic/index`,  dictionary.database.indexLemmaIndex)
  // splitIdx(dictionary)
  // const data = splitData(dictionary)
  // const start = 1000
  // for (var i = start; i < 10; i++) {
  //   console.log(dictionary.database.data[i]) // offset
  //   // dataLemma = data.word
  // }
  // console.log("===")
  // for (var i = start; i < start + 20; i++){
  //   console.log(dictionary.database.index[i])
  // }
  // console.log(dictionary.database.index.length)
  // console.log(dictionary.database.index)
  // console.log(dictionary.database.getSize())
  
}

start()