import { CyclicSeedGenerator } from './cyclic-seed';
import { wheelModifiedTwoGenerator } from './seed-generator/wheel-modified-2.generator';
import { wheelModifiedThreeGenerator } from './seed-generator/wheel-modified-3.generator';
import { wheelModifiedFourGenerator } from './seed-generator/wheel-modified-4.generator';
import { wheelGenerator } from './seed-generator/wheel.generator';

/** Generates a cyclic seed. `participantCount` must be divisible by 4 and greater than or equal to 16. */
export const cyclicSeedGenerator: CyclicSeedGenerator = (participantCount: number) => {
  switch (participantCount % 24) {
    case 4:
    case 20:
      return wheelGenerator(participantCount);
    case 8:
    case 16:
      return wheelModifiedTwoGenerator(participantCount);
    case 12:
      return wheelModifiedThreeGenerator(participantCount);
    case 0:
      return wheelModifiedFourGenerator(participantCount);
  }
  /* istanbul ignore next */
  throw new Error('Invalid participant count!');
};
