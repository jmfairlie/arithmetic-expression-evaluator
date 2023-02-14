import { TOKEN_TYPES } from '~/constants'
import type { TApplyFuncs, TOKEN_TYPE } from '~/types'
/*
 * This variables can be modified to some aspects of the expression syntax
 * For example we could add new operators or change their symbols or precedence.
 */
const TOKEN_TYPE_DETECTORS: Record<TOKEN_TYPE, RegExp[]> = {
  VARIABLE: [/^\$[A-Z_][A-Z0-9_]*/],
  NUMBER: [/^[0-9]*\.?[0-9]+/],
  //ambiguous operators could be prefix or postfix
  UNOP: [/^--/, /^\+\+/, /^-/],
  POOP: [],
  INOP: [
    /^\+/,
    /^\//,
    /^\*/,
    /^\^/,
    /^==/,
    /^&&/,
    /^\|\|/,
    /^>=/,
    /^<=/,
    /^>/,
    /^</,
  ],
  PROP: [/^!/],
  LP: [/^\(/],
  RP: [/^\)/],
  NL: [/\n/],
  SP: [/^\s+/],
}

//ambiguous operators go here
const opDisambiguation = {
  '-': [TOKEN_TYPES.INOP, TOKEN_TYPES.PROP],
  '--': [TOKEN_TYPES.PROP, TOKEN_TYPES.POOP],
  '++': [TOKEN_TYPES.PROP, TOKEN_TYPES.POOP],
} as const

// higher value means higher precedence
const opPrecedence = {
  INOP: {
    '^': 13,
    '*': 12,
    '/': 12,
    '-': 11,
    '+': 11,
    '==': 8,
    '&&': 4,
    '||': 3,
    '<': 9,
    '<=': 9,
    '>': 9,
    '>=': 9,
  },
  POOP: {
    '--': 15,
    '++': 15,
  },
  PROP: {
    '-': 14,
    '!': 14,
    '--': 14,
    '++': 14,
  },
}

const executeOperator: TApplyFuncs = {
  INOP: {
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '/': (a: number, b: number) => a / b,
    '*': (a: number, b: number) => a * b,
    '<': (a: number, b: number) => a < b,
    '<=': (a: number, b: number) => a <= b,
    '>': (a: number, b: number) => a > b,
    '>=': (a: number, b: number) => a >= b,
    '&&': (a: boolean, b: boolean) => a && b,
    '||': (a: boolean, b: boolean) => a || b,
    '==': (a: number, b: number) => a === b,
    '^': (a: number, b: number) => a ** b,
  },
  PROP: {
    '-': (a: number) => -a,
    '!': (a: number | boolean) => !a,
    '++': (a: number) => ++a,
    '--': (a: number) => --a,
  },
  POOP: {
    '++': (a: number) => a++,
    '--': (a: number) => a--,
  },
} as const

export { TOKEN_TYPE_DETECTORS, opPrecedence, opDisambiguation, executeOperator }
