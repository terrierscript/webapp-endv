import fs from "fs"
import md5 from "md5"

const w2dg = (l) => {
  const digest = md5(l)
  const k = digest.slice(0, 2)
  return k
}

export const searchIndex = (word: string) => {
  const dig = w2dg(word)
  const a = JSON.parse(fs.readFileSync(`dic/index/${dig}.json`).toString())
  return a[word]
}

export const searchData = (offset: string|number) => {
  const dig = w2dg(offset.toString())
  const a = JSON.parse(fs.readFileSync(`dic/data/${dig}.json`).toString())
  return a[offset]
}
