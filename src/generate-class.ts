import crypto from 'crypto'

const generatedClasses = new Set<string>()

export function generateClass(): string {
  const randomHex = crypto.randomBytes(30).toString('hex')
  const match = /\D.{5}/.exec(randomHex)
  if (match == null) {
    return generateClass()
  }
  const c = match[0]
  if (generatedClasses.has(c)) {
    return generateClass()
  }
  generatedClasses.add(c)
  return c
}
