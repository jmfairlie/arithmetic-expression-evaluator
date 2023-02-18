import type { TChunks, TINOPS, TPOOPS, TPROPS, TTokens, TUNOPS } from '~/types';

import { CHUNK_SUBTYPES, CHUNK_TYPES, TOKEN_TYPES } from '~/constants';

const preprocess = (tokens: TTokens) => {
  let parens = 0;
  let subExpCol;
  let subExpRow;
  const subexpressionTokens: TTokens = [];
  const chunks: TChunks = [];
  for (const token of tokens) {
    switch (token.type) {
      case TOKEN_TYPES.LP:
        if (parens) {
          subexpressionTokens.push(token);
        } else {
          subExpCol = token.col;
          subExpRow = token.row;
        }
        parens++;
        break;
      case TOKEN_TYPES.RP:
        if (parens > 0) {
          if (parens === 1) {
            chunks.push({
              value: preprocess([...subexpressionTokens]),
              type: CHUNK_TYPES.EXPRESSION,
              subtype: CHUNK_SUBTYPES.SUBEXPRESSION,
              row: subExpRow,
              col: subExpCol,
            });
            subexpressionTokens.length = 0;
          } else {
            subexpressionTokens.push(token);
          }
          parens--;
        } else {
          throw new Error(
            `unmatched right parens in line:${token.row} col:${token.col}`,
          );
        }
        break;
      default: {
        const base = {
          row: token.row,
          col: token.col,
        };
        let chunk;

        switch (token.type) {
          case TOKEN_TYPES.VARIABLE:
            chunk = {
              ...base,
              value: token.value,
              type: CHUNK_TYPES.EXPRESSION,
              subtype: CHUNK_SUBTYPES.VARIABLE,
            };
            break;
          case TOKEN_TYPES.NUMBER:
            chunk = {
              ...base,
              value: token.value,
              type: CHUNK_TYPES.EXPRESSION,
              subtype: CHUNK_SUBTYPES.NUMBER,
            };
            break;
          case TOKEN_TYPES.UNOP:
            chunk = {
              ...base,
              value: token.value as TUNOPS,
              type: CHUNK_TYPES.OPERATOR,
              subtype: CHUNK_SUBTYPES.UNOP,
            };
            break;
          case TOKEN_TYPES.INOP:
            chunk = {
              ...base,
              value: token.value as TINOPS,
              type: CHUNK_TYPES.OPERATOR,
              subtype: CHUNK_SUBTYPES.INOP,
            };
            break;
          case TOKEN_TYPES.PROP:
            chunk = {
              ...base,
              value: token.value as TPROPS,
              type: CHUNK_TYPES.OPERATOR,
              subtype: CHUNK_SUBTYPES.PROP,
            };
            break;
          case TOKEN_TYPES.POOP:
            chunk = {
              ...base,
              value: token.value as TPOOPS,
              type: CHUNK_TYPES.OPERATOR,
              subtype: CHUNK_SUBTYPES.POOP,
            };
            break;
        }

        if (parens) {
          subexpressionTokens.push(token);
        } else {
          chunks.push(chunk);
        }
      }
    }
  }
  return chunks;
};

export default preprocess;
