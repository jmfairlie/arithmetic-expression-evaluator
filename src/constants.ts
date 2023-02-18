const OP_TYPES = {
  UNOP: 'UNOP',
  INOP: 'INOP',
  POOP: 'POOP',
  PROP: 'PROP',
} as const;

const TOKEN_TYPES = {
  NUMBER: 'NUMBER',
  ...OP_TYPES,
  LP: 'LP',
  RP: 'RP',
  NL: 'NL',
  SP: 'SP',
  VARIABLE: 'VARIABLE',
} as const;

const CHUNK_SUBTYPES = {
  ...TOKEN_TYPES,
  SUBEXPRESSION: 'SUBEXPRESSION',
} as const;

const CHUNK_TYPES = {
  EXPRESSION: 'EXPRESSION',
  OPERATOR: 'OPERATOR',
} as const;

export {
  executeOperator,
  opDisambiguation,
  opPrecedence,
  TOKEN_TYPE_DETECTORS,
} from '~/config';
export { OP_TYPES, TOKEN_TYPES, CHUNK_SUBTYPES, CHUNK_TYPES };
