import tokenize from '~/utils/tokenize';

describe('tokenize', () => {
  const expr0 = '100';
  const expr1 = '1+1';
  const expr2 = '1     +       1';
  const expr3 = '$VARIABLE';
  const expr4 = '3 + 5 / ( 12 - 7) * 3 - 2';

  test(expr0, () => {
    const expected = [{ value: '100', type: 'NUMBER', row: 0, col: 0 }];
    const tokens = tokenize(expr0);
    expect(tokens).toEqual(expect.arrayContaining(expected));
  });

  test(expr1, () => {
    const expected = [
      { value: '1', type: 'NUMBER', row: 0, col: 0 },
      { value: '+', type: 'INOP', row: 0, col: 1 },
      { value: '1', type: 'NUMBER', row: 0, col: 2 },
    ];
    const tokens = tokenize(expr1);
    expect(tokens).toEqual(expect.arrayContaining(expected));
  });

  test(expr2, () => {
    const expected = [
      { value: '1', type: 'NUMBER', row: 0, col: 0 },
      { value: '+', type: 'INOP', row: 0, col: 6 },
      { value: '1', type: 'NUMBER', row: 0, col: 14 },
    ];
    const tokens = tokenize(expr2);
    expect(tokens).toEqual(expect.arrayContaining(expected));
  });

  test(expr3, () => {
    const expected = [{ value: '$VARIABLE', type: 'VARIABLE', row: 0, col: 0 }];
    const tokens = tokenize(expr3);
    expect(tokens).toEqual(expect.arrayContaining(expected));
  });

  test(expr4, () => {
    const expected = [
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
    ];

    const tokens = tokenize(expr4);
    expect(tokens).toEqual(expect.arrayContaining(expected));
  });
});
