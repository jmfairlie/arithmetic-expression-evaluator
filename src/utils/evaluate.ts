import { executeOperator, TOKEN_TYPES } from '~/constants';

import type { TContext, TLeaf, TOperatorChunk, TTree } from '~/types';

const evaluate = (parseTree: TLeaf | TTree, context: TContext = {}): TLeaf => {
  const mode = typeof parseTree;

  switch (mode) {
    case 'boolean':
    case 'number':
      return parseTree as TLeaf;
    case 'string':
      if ((parseTree as string) in context) {
        return context[parseTree as string];
      }

      throw new Error(`unknown variable ${parseTree}`);
    default: {
      const { left, op, right } = parseTree as TTree;
      const { subtype: opType, value: opValue } = op as TOperatorChunk;
      let leftOperand;
      let rightOperand;
      switch (opType) {
        case TOKEN_TYPES.INOP:
          leftOperand = evaluate(left, context);
          rightOperand = evaluate(right, context);
          //@ts-expect-error no idea fix this
          return executeOperator.INOP[opValue](leftOperand, rightOperand);

        case TOKEN_TYPES.POOP:
          leftOperand = evaluate(left, context);
          return executeOperator.POOP[opValue](leftOperand as number);
        case TOKEN_TYPES.PROP:
          rightOperand = evaluate(right, context);
          //@ts-expect-error no idea fix this
          return executeOperator.PROP[opValue](rightOperand);
      }
    }
  }
};
export default evaluate;
