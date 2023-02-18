import { TTokens } from '~/types'
import preprocess from '~/utils/preprocess'

describe('preprocess', () => {
  const expr0 = '100'
  const expr1 = '1+1'
  const expr2 = '$VARIABLE'
  const expr3 = '3 + 5 / ( 12 - 7) * 3 - 2'

  test(expr0, () => {
    const tokens: TTokens = [{ value: '100', type: 'NUMBER', row: 0, col: 0 }]
    const expected = [
      {
        row: 0,
        col: 0,
        value: '100',
        type: 'EXPRESSION',
        subtype: 'NUMBER',
      },
    ]

    const chunks = preprocess(tokens)
    expect(chunks).toEqual(expect.arrayContaining(expected))
  })

  test(expr1, () => {
    const tokens: TTokens = [
      { value: '1', type: 'NUMBER', row: 0, col: 0 },
      { value: '+', type: 'INOP', row: 0, col: 1 },
      { value: '1', type: 'NUMBER', row: 0, col: 2 },
    ]

    const expected = [
      { value: '1', type: 'EXPRESSION', subtype: 'NUMBER', row: 0, col: 0 },
      { value: '+', type: 'OPERATOR', subtype: 'INOP', row: 0, col: 1 },
      { value: '1', type: 'EXPRESSION', subtype: 'NUMBER', row: 0, col: 2 },
    ]
    const chunks = preprocess(tokens)
    expect(chunks).toEqual(expect.arrayContaining(expected))
  })

  test(expr2, () => {
    const tokens: TTokens = [
      { value: '$VARIABLE', type: 'VARIABLE', row: 0, col: 0 },
    ]
    const expected = [
      {
        value: '$VARIABLE',
        type: 'EXPRESSION',
        subtype: 'VARIABLE',
        row: 0,
        col: 0,
      },
    ]
    const chunks = preprocess(tokens)
    expect(chunks).toEqual(expect.arrayContaining(expected))
  })

  test(expr3, () => {
    const tokens: TTokens = [
      { value: '3', type: 'NUMBER', row: 0, col: 0 },
      { value: '+', type: 'INOP', row: 0, col: 2 },
      { value: '5', type: 'NUMBER', row: 0, col: 4 },
      { value: '/', type: 'INOP', row: 0, col: 6 },
      { value: '(', type: 'LP', row: 0, col: 8 },
      { value: '12', type: 'NUMBER', row: 0, col: 10 },
      { value: '-', type: 'UNOP', row: 0, col: 13 },
      { value: '7', type: 'NUMBER', row: 0, col: 15 },
      { value: ')', type: 'RP', row: 0, col: 16 },
      { value: '*', type: 'INOP', row: 0, col: 18 },
      { value: '3', type: 'NUMBER', row: 0, col: 20 },
      { value: '-', type: 'UNOP', row: 0, col: 22 },
      { value: '2', type: 'NUMBER', row: 0, col: 24 },
    ]

    const expected = [
      { row: 0, col: 0, value: '3', type: 'EXPRESSION', subtype: 'NUMBER' },
      { row: 0, col: 2, value: '+', type: 'OPERATOR', subtype: 'INOP' },
      { row: 0, col: 4, value: '5', type: 'EXPRESSION', subtype: 'NUMBER' },
      { row: 0, col: 6, value: '/', type: 'OPERATOR', subtype: 'INOP' },
      {
        col: 8,
        row: 0,
        value: [
          {
            row: 0,
            col: 10,
            value: '12',
            type: 'EXPRESSION',
            subtype: 'NUMBER',
          },
          { row: 0, col: 13, value: '-', type: 'OPERATOR', subtype: 'UNOP' },
          {
            row: 0,
            col: 15,
            value: '7',
            type: 'EXPRESSION',
            subtype: 'NUMBER',
          },
        ],
        type: 'EXPRESSION',
        subtype: 'SUBEXPRESSION',
      },
      { row: 0, col: 18, value: '*', type: 'OPERATOR', subtype: 'INOP' },
      { row: 0, col: 20, value: '3', type: 'EXPRESSION', subtype: 'NUMBER' },
      { row: 0, col: 22, value: '-', type: 'OPERATOR', subtype: 'UNOP' },
      { row: 0, col: 24, value: '2', type: 'EXPRESSION', subtype: 'NUMBER' },
    ]

    const chunks = preprocess(tokens)
    expect(chunks).toEqual(expect.arrayContaining(expected))
  })
})
