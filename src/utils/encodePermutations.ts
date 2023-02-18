import type { TAmbiguities, TPermutation } from '~/types';

const encodePermutations = (
  sources: TAmbiguities[] = [],
  results: TPermutation[] = [],
): TPermutation[] => {
  const [{ idx = -1, alternatives = undefined } = {}, ...rest] = sources;
  if (alternatives) {
    let newResults;
    if (results.length === 0) {
      newResults = alternatives.map((o) => ({ [idx]: o }));
    } else {
      newResults = results.reduce((acc, v) => {
        return [...acc, ...alternatives.map((s) => ({ ...v, [idx]: s }))];
      }, [] as TPermutation[]);
    }
    return encodePermutations(rest, newResults);
  } else {
    return results;
  }
};

export default encodePermutations;
