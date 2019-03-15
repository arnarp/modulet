const cssClassRegex = /\.([A-Za-z]\w*)/g

export function getDistinctCssClasses(code: string) {
  const set = new Set<string>()
  let match: RegExpExecArray | null = null
  while ((match = cssClassRegex.exec(code))) {
    set.add(match[1])
  }
  return set
}
