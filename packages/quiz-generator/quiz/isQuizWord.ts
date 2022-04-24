export const isQuizWord = (f: string) => {
  if (!f)
    return false
  // if (f === word) return false
  // if (f.split(" ").length !== 1) return false
  if (f.split("-").length !== 1)
    return false
  if (/[A-Z]/.test(f))
    return false
  if (/[0-9]/.test(f))
    return false
  return true
}
