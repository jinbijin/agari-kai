import { CyclicSeedGenerator } from '../cyclic-seed';

/** The classic wheel. Works when `participantCount` is 4 or 20 modulo 24. */
export const wheelGenerator: CyclicSeedGenerator = (participantCount: number) => {
  const roundCount = participantCount / 4;

  return {
    participantCount,
    roundCount,
    seed: [...generateSeed(roundCount)],
  };
};

function* generateSeed(roundCount: number): Generator<[number, number, number]> {
  for (let i = 0; i < roundCount; i++) {
    yield [i, 2 * i, 3 * i];
  }
}
