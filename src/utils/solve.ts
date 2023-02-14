import type { TContext } from '~/types'
import evaluate from './evaluate'
import parse from './parse'
import preprocess from './preprocess'
import tokenize from './tokenize'
const solve = (expression: string, context: TContext = {}) => {
  const tokens = tokenize(expression)
  const chunks = preprocess(tokens)
  const parseTree = parse(chunks)
  return evaluate(parseTree, context)
}

export default solve
