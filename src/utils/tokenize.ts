import { TOKEN_TYPES, TOKEN_TYPE_DETECTORS } from '~/constants'
import type { TOKEN_TYPE, TTokens } from '~/types'

const tokenize = (
  str: string,
  row = 0,
  col = 0,
  tokens: TTokens = [],
  types = TOKEN_TYPE_DETECTORS
): TTokens => {
  let strCpy = str
  let charCount = 0
  let rowCount = row
  if (strCpy) {
    const matchers = Object.entries(types)
    let m
    for (const matcher of matchers) {
      const [_type, [...regexes]] = matcher

      /*
       * Object.entries type inference is weird
       * see https://github.com/microsoft/TypeScript/issues/35101
       */
      const type = _type as TOKEN_TYPE
      for (const regex of regexes) {
        m = strCpy.match(regex)
        if (m) {
          charCount += m[0].length
          //ignore spaces and newlines
          if (type !== TOKEN_TYPES.SP && type !== TOKEN_TYPES.NL) {
            tokens.push({ value: m[0], type, row, col })
          } else if (type === TOKEN_TYPES.NL) {
            charCount = 0
            rowCount += 1
          }
          strCpy = strCpy.slice(m[0].length)
          return tokenize(strCpy, rowCount, col + charCount, [...tokens], types)
        }
      }
    }
    throw new Error(
      `unrecognized token "${strCpy}" in line:${rowCount} col:${col}`
    )
  } else {
    return tokens
  }
}

export default tokenize
