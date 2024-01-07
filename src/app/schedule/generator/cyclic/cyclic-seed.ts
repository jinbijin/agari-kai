export interface CyclicSeed {
  participantCount: number;
  roundCount: number;
  seed: [number, number, number][];
}

/** The cyclic seed generator type. When implementing this, may assume that the participant count is validated. */
export type CyclicSeedGenerator = (participantCount: number) => CyclicSeed;
