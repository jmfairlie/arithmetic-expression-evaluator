import { TChunks } from '~/types';
import buildTree from '~/utils/buildTree';

describe('buildTree', () => {
  const expr0 = '100';
  const expr1 = '1+1';
  const expr2 = '$VARIABLE';
  const expr3 = '3 + 5 / ( 12 - 7) * 3 - 2';

  test(expr0, () => {
    const chunks: TChunks = [
      {
        row: 0,
        col: 0,
        value: '100',
        type: 'EXPRESSION',
        subtype: 'NUMBER',
      },
    ];
    const expected = 100;

    const tree = buildTree(chunks);
    expect(tree).toEqual(expected);
  });

  test(expr1, () => {
    const chunks: TChunks = [
      { value: '1', type: 'EXPRESSION', subtype: 'NUMBER', row: 0, col: 0 },
      { value: '+', type: 'OPERATOR', subtype: 'INOP', row: 0, col: 1 },
      { value: '1', type: 'EXPRESSION', subtype: 'NUMBER', row: 0, col: 2 },
    ];
    const expected = {
      left: 1,
      op: { value: '+', type: 'OPERATOR', subtype: 'INOP', row: 0, col: 1 },
      right: 1,
    };

    const tree = buildTree(chunks);
    expect(tree).toEqual(expected);
  });

  test(expr2, () => {
    const chunks: TChunks = [
      {
        row: 0,
        col: 0,
        value: '$VARIABLE',
        type: 'EXPRESSION',
        subtype: 'VARIABLE',
      },
    ];
    const expected = '$VARIABLE';

    const tree = buildTree(chunks);
    expect(tree).toEqual(expected);
  });

  test(expr3, () => {
    const chunks: TChunks = [
      { row: 0, col: 0, value: '3', type: 'EXPRESSION', subtype: 'NUMBER' },
      { row: 0, col: 2, value: '+', type: 'OPERATOR', subtype: 'INOP' },
      { row: 0, col: 4, value: '5', type: 'EXPRESSION', subtype: 'NUMBER' },
      { row: 0, col: 6, value: '/', type: 'OPERATOR', subtype: 'INOP' },
      {
        col: 0,
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
    ];

    const expected = {
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
    };

    const tree = buildTree(chunks);
    expect(tree).toEqual(expected);
  });
});
