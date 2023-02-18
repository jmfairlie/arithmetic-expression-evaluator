import type { TContext } from '~/types';
import buildTree from './buildTree';
import evaluate from './evaluate';
import preprocess from './preprocess';
import tokenize from './tokenize';

const solve = (expression: string, context: TContext = {}) => {
  const tokens = tokenize(expression);
  const chunks = preprocess(tokens);
  const tree = buildTree(chunks);
  return evaluate(tree, context);
};

export default solve;
