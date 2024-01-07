import { CyclicSeedGenerator } from '../cyclic-seed';

/** A modified version of the classic wheel which works when `participantCount` is 8 or 16 modulo 24. */
export const wheelModifiedTwoGenerator: CyclicSeedGenerator = (participantCount: number) => {
  const tableCount = participantCount / 4;
  const seed = [...generateSeed(tableCount)];

  return {
    participantCount,
    roundCount: seed.length,
    seed,
  };
};

function* generateSeed(tableCount: number): Generator<[number, number, number]> {
  const halfPoint = tableCount / 2;

  for (let i = 0; i < halfPoint - 1; i++) {
    yield [i, 2 * i, 3 * i];
  }

  for (let i = halfPoint; i < tableCount - 1; i++) {
    yield [i - 1, 2 * i - 1, 3 * i];
  }
}
