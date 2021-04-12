export const fetcher = (url: string) => {
  console.log("fetch", url)
  return window.fetch(url).then(res => res.json())
}
