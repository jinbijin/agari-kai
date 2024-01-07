import { CyclicSeedGenerator } from '../cyclic-seed';

/** A modified version of the classic wheel which works when `participantCount` is 0 modulo 24. */
export const wheelModifiedFourGenerator: CyclicSeedGenerator = (participantCount: number) => {
  const tableCount = participantCount / 4;
  const seed = [...generateSeed(tableCount)];

  return {
    participantCount,
    roundCount: seed.length,
    seed,
  };
};

function* generateSeed(tableCount: number): Generator<[number, number, number]> {
  const oneThirdPoint = tableCount / 3;
  const halfPoint = tableCount / 2;
  const twoThirdsPoint = (tableCount * 2) / 3;

  for (let i = 0; i < oneThirdPoint; i++) {
    yield [i, 2 * i, 3 * i];
  }

  for (let i = oneThirdPoint; i < halfPoint - 1; i++) {
    yield [i + 2, 2 * i + 2, 3 * i + 2];
  }

  for (let i = halfPoint; i < twoThirdsPoint - 1; i++) {
    yield [i + 1, 2 * i + 1, 3 * i + 2];
  }

  for (let i = twoThirdsPoint; i < tableCount - 1; i++) {
    yield [i, 2 * i + 1, 3 * i + 1];
  }
}
