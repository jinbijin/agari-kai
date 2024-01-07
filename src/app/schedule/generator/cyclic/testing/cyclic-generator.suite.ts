import { remEuclid } from '../../../../common/rem-euclid';
import { CyclicSeedGenerator } from '../cyclic-seed';

export function runCyclicGeneratorSuite(generator: CyclicSeedGenerator, inputs: number[]): void {
  describe(generator.name, () => {
    for (const input of inputs) {
      describe(`for ${input} participants`, () => {
        it('should echo the input participant count', () => {
          const cyclicSeed = generator(input);

          expect(cyclicSeed.participantCount).toBe(input);
        });

        it('should generate the correct number of rounds', () => {
          const cyclicSeed = generator(input);

          expect(cyclicSeed.seed).toHaveLength(cyclicSeed.roundCount);
        });

        it('should not have collisions between the first and second seat', () => {
          const cyclicSeed = generator(input);
          const tableCount = input / 4;

          const differences = new Set(cyclicSeed.seed.map((item) => remEuclid(item[0], tableCount)));

          expect(differences.size).toBe(cyclicSeed.roundCount);
        });

        it('should not have collisions between the second and third seat', () => {
          const cyclicSeed = generator(input);
          const tableCount = input / 4;

          const differences = new Set(cyclicSeed.seed.map((item) => remEuclid(item[1] - item[0], tableCount)));

          expect(differences.size).toBe(cyclicSeed.roundCount);
        });

        it('should not have collisions between the third and fourth seat', () => {
          const cyclicSeed = generator(input);
          const tableCount = input / 4;

          const differences = new Set(cyclicSeed.seed.map((item) => remEuclid(item[2] - item[1], tableCount)));

          expect(differences.size).toBe(cyclicSeed.roundCount);
        });

        it('should not have collisions between the first and third seat', () => {
          const cyclicSeed = generator(input);
          const tableCount = input / 4;

          const differences = new Set(cyclicSeed.seed.map((item) => remEuclid(item[1], tableCount)));

          expect(differences.size).toBe(cyclicSeed.roundCount);
        });

        it('should not have collisions between the second and fourth seat', () => {
          const cyclicSeed = generator(input);
          const tableCount = input / 4;

          const differences = new Set(cyclicSeed.seed.map((item) => remEuclid(item[2] - item[0], tableCount)));

          expect(differences.size).toBe(cyclicSeed.roundCount);
        });

        it('should not have collisions between the first and fourth seat', () => {
          const cyclicSeed = generator(input);
          const tableCount = input / 4;

          const differences = new Set(cyclicSeed.seed.map((item) => remEuclid(item[2], tableCount)));

          expect(differences.size).toBe(cyclicSeed.roundCount);
        });
      });
    }
  });
}
