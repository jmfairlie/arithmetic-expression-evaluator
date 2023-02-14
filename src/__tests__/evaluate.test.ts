import { TTree } from '~/types'
import evaluate from '~/utils/evaluate'

describe('evaluate', () => {
  const expr0 = '100'
  const expr1 = '1+1'
  const expr2 = '$VARIABLE'
  const expr3 = '3 + 5 / ( 12 - 7) * 3 - 2'
  const expr4 = '$UNDEFINEDVAR'

  test(expr0, () => {
    const tree = 100
    const expected = 100

    const results = evaluate(tree)
    expect(results).toEqual(expected)
  })

  test(expr1, () => {
    const tree: TTree = {
      left: 1,
      op: { value: '+', type: 'OPERATOR', subtype: 'INOP', row: 0, col: 1 },
      right: 1,
    }
    const expected = 2

    const results = evaluate(tree)
    expect(results).toEqual(expected)
  })

  test(expr2, () => {
    const tree = expr2
    const expected = 99

    const results = evaluate(tree, { $VARIABLE: 99 })
    expect(results).toEqual(expected)
  })

  test(expr3, () => {
    const tree: TTree = {
      left: {
        left: 3,
        op: { row: 0, col: 2, value: '+', type: 'OPERATOR', subtype: 'INOP' },
        right: {
          left: {
            left: 5,
            op: {
              row: 0,
              col: 6,
              value: '/',
              type: 'OPERATOR',
              subtype: 'INOP',
            },
            right: {
              left: 12,
              op: {
                row: 0,
                col: 13,
                value: '-',
                type: 'OPERATOR',
                subtype: 'INOP',
              },
              right: 7,
            },
          },
          op: {
            row: 0,
            col: 18,
            value: '*',
            type: 'OPERATOR',
            subtype: 'INOP',
          },
          right: 3,
        },
      },
      op: {
        row: 0,
        col: 22,
        value: '-',
        type: 'OPERATOR',
        subtype: 'INOP',
      },
      right: 2,
    }

    const expected = 4

    const results = evaluate(tree)
    expect(results).toEqual(expected)
  })

  test('undefined var should throw', () => {
    const tree = expr4

    expect(() => {
      evaluate(tree)
    }).toThrow()
  })
})
