import {
  CHUNK_SUBTYPES,
  CHUNK_TYPES,
  opDisambiguation,
  opPrecedence,
  OP_TYPES,
  TOKEN_TYPES,
} from './constants'

type TOKEN_TYPE = keyof typeof TOKEN_TYPES
type TCHUNK_SUBTYPE = keyof typeof CHUNK_SUBTYPES
type TCHUNK_TYPE = keyof typeof CHUNK_TYPES

type TTokens = { value: string; type: TOKEN_TYPE; row: number; col: number }[]

type TSubExpression = {
  value: TChunks
  type: Extract<TCHUNK_TYPE, 'EXPRESSION'>
  subtype: Extract<TCHUNK_SUBTYPE, 'SUBEXPRESSION'>
}

type TOpUnop = {
  value: TUNOPS
  row: number
  col: number
  type: Extract<TCHUNK_TYPE, 'OPERATOR'>
  subtype: Extract<TCHUNK_SUBTYPE, 'UNOP'>
}
type TOpInop = {
  value: TINOPS
  row: number
  col: number
  type: Extract<TCHUNK_TYPE, 'OPERATOR'>
  subtype: Extract<TCHUNK_SUBTYPE, 'INOP'>
}
type TOpProp = {
  value: TPROPS
  row: number
  col: number
  type: Extract<TCHUNK_TYPE, 'OPERATOR'>
  subtype: Extract<TCHUNK_SUBTYPE, 'PROP'>
}
type TOpPoop = {
  value: TPOOPS
  row: number
  col: number
  type: Extract<TCHUNK_TYPE, 'OPERATOR'>
  subtype: Extract<TCHUNK_SUBTYPE, 'POOP'>
}

type TOperatorChunk = TOpUnop | TOpInop | TOpProp | TOpPoop

type TChunk =
  | {
      value: string
      row: number
      col: number
      type: Extract<TCHUNK_TYPE, 'EXPRESSION'>
      subtype: Exclude<
        TCHUNK_SUBTYPE,
        'SUBEXPRESSION' | 'UNOP' | 'INOP' | 'POOP' | 'PROP'
      >
    }
  | TOperatorChunk
  | TSubExpression

type TChunks = TChunk[]

type TOPTypes = keyof typeof OP_TYPES

type TUNOPS = keyof typeof opDisambiguation
type TINOPS = keyof typeof opPrecedence.INOP
type TPOOPS = keyof typeof opPrecedence.POOP
type TPROPS = keyof typeof opPrecedence.PROP

interface func<T, U = T> {
  (a: T, b?: T): U
}

type TFINOP = Record<
  TINOPS,
  func<number> | func<boolean> | func<number, boolean>
>
type TFPROP = Record<
  TPROPS,
  func<number> | func<boolean> | func<number, boolean>
>
type TFPOOP = Record<TPOOPS, func<number>>

type TApplyFuncs = {
  INOP: TFINOP
  PROP: TFPROP
  POOP: TFPOOP
}

type TDisambiguation = typeof opDisambiguation
type TAlternatives = TDisambiguation[TUNOPS]

type TAmbiguities = { idx: number; alternatives: TAlternatives }

type TLeaf = number | string | boolean
type TTree = { left?: TLeaf | TTree; op: TChunk; right?: TLeaf | TTree }

type TPermutation = Record<number, Exclude<TOPTypes, 'UNOP'>>
type TContext = Record<string, TLeaf>

export type {
  TOKEN_TYPE,
  TCHUNK_SUBTYPE,
  TCHUNK_TYPE,
  TTokens,
  TSubExpression,
  TOpUnop,
  TOpInop,
  TOpPoop,
  TOpProp,
  TOperatorChunk,
  TChunk,
  TChunks,
  TOPTypes,
  TUNOPS,
  TINOPS,
  TPOOPS,
  TPROPS,
  TApplyFuncs,
  TLeaf,
  TTree,
  TAmbiguities,
  TPermutation,
  TContext,
}
