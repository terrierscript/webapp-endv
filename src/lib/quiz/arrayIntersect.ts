export const arrayIntersect = (targetArr: string[], filterSet: Set<string>) => {
  return targetArr.filter(item => !filterSet.has(item))
}
