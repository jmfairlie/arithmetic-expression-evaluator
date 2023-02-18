import {
  CHUNK_SUBTYPES,
  CHUNK_TYPES,
  opDisambiguation,
  opPrecedence,
  TOKEN_TYPES,
} from '~/constants';

import type { TChunks, TLeaf, TTree } from '~/types';
import encodePermutations from './encodePermutations';

const buildTree = (chunks: TChunks): TLeaf | TTree => {
  let opIndex;
  let i = 0;
  let currPrecedence;

  if (chunks.length === 1) {
    const [chunk] = chunks;
    if (chunk.type === CHUNK_TYPES.EXPRESSION) {
      switch (chunk.subtype) {
        case CHUNK_SUBTYPES.SUBEXPRESSION:
          return buildTree(chunk.value);
        case CHUNK_SUBTYPES.VARIABLE:
          return chunk.value;
        case CHUNK_SUBTYPES.NUMBER:
        default:
          return parseFloat(chunk.value);
      }
    }
    throw new Error(
      `syntax error: invalid expression "${chunk.value}" in line:${chunk.row} col:${chunk.col}`,
    );
  } else {
    const ambiguities = [];

    for (const chunk of chunks) {
      if (
        chunk.type === CHUNK_TYPES.OPERATOR &&
        chunk.subtype == TOKEN_TYPES.UNOP
      ) {
        chunk.value;
        ambiguities.push({
          idx: i,
          alternatives: opDisambiguation[chunk.value],
        });
      }
      i++;
    }

    const permutations = encodePermutations(ambiguities);

    const errors = [];

    do {
      i = 0;
      opIndex = -1;
      currPrecedence = Infinity;

      //get next permutation if any
      const permutation = permutations.shift();

      const chunksCpy = chunks.map((v) => ({ ...v }));

      //find the operator with lowest precedence
      for (const chunk of chunksCpy) {
        if (chunk.type === CHUNK_TYPES.OPERATOR) {
          //if it is an UNOP(ambiguous) operator get value from current permutation
          if (chunk.subtype === CHUNK_SUBTYPES.UNOP) {
            //@ts-expect-error type hell
            chunk.subtype = permutation[i];
          }

          //@ts-expect-error type hell
          const precedence = opPrecedence[chunk.subtype][chunk.value];

          if (precedence <= currPrecedence) {
            currPrecedence = precedence;
            opIndex = i;
          }
        }
        i++;
      }

      try {
        if (opIndex === -1) {
          throw new Error(
            `invalid expression has no operators ${JSON.stringify(chunksCpy)}`,
          );
        }

        const op = chunksCpy[opIndex];
        const leftExp = chunksCpy.slice(0, opIndex);
        const rightExp = chunksCpy.slice(opIndex + 1);

        switch (op.subtype) {
          case CHUNK_SUBTYPES.INOP:
            if (!leftExp.length) {
              throw new Error(
                `missing left operand for operator '${op.value}' in line: ${op.row} col: ${op.col}`,
              );
            }
            if (!rightExp.length) {
              throw new Error(
                `missing right operand for operator '${op.value}' in line: ${op.row} col: ${op.col}`,
              );
            }
            return {
              left: buildTree(leftExp),
              op,
              right: buildTree(rightExp),
            };
          case CHUNK_SUBTYPES.POOP:
            if (!leftExp.length) {
              throw new Error(
                `missing left operand for operator '${op.value}' in line: ${op.row} col: ${op.col}`,
              );
            }
            if (rightExp.length) {
              throw new Error(
                `unexpected right operand for suffix operator '${op.value}' in line: ${op.row} col: ${op.col}`,
              );
            }
            return {
              left: buildTree(leftExp),
              op,
            };
          case CHUNK_SUBTYPES.PROP:
            if (!rightExp.length) {
              throw new Error(
                `missing right operand for operator '${op.value}' in line: ${op.row} col: ${op.col}`,
              );
            }
            if (leftExp.length) {
              throw new Error(
                `unexpected left operand for prefix operator '${op.value}' in line: ${op.row} col: ${op.col}`,
              );
            }
            return {
              op,
              right: buildTree(rightExp),
            };
        }
      } catch (err) {
        errors.push(err);
      }
    } while (permutations.length);

    if (errors.length) {
      throw errors.pop();
    }
  }
};

export default buildTree;
