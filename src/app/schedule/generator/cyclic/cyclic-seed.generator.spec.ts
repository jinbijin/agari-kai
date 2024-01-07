jest.mock('./seed-generator/wheel.generator');
jest.mock('./seed-generator/wheel-modified-2.generator');
jest.mock('./seed-generator/wheel-modified-3.generator');
jest.mock('./seed-generator/wheel-modified-4.generator');

import { CyclicSeedGenerator } from './cyclic-seed';
import { cyclicSeedGenerator } from './cyclic-seed.generator';
import { wheelModifiedTwoGenerator } from './seed-generator/wheel-modified-2.generator';
import { wheelModifiedThreeGenerator } from './seed-generator/wheel-modified-3.generator';
import { wheelModifiedFourGenerator } from './seed-generator/wheel-modified-4.generator';
import { wheelGenerator } from './seed-generator/wheel.generator';

describe(cyclicSeedGenerator.name, () => {
  beforeEach(() => {
    (wheelGenerator as jest.Mock).mockClear();
    (wheelModifiedTwoGenerator as jest.Mock).mockClear();
    (wheelModifiedThreeGenerator as jest.Mock).mockClear();
    (wheelModifiedFourGenerator as jest.Mock).mockClear();
  });

  it('should call the classic wheel if participant count is 4 modulo 24', () => {
    itShouldCallForInput(wheelGenerator, 28);
  });

  it('should call the classic wheel if participant count is 20 modulo 24', () => {
    itShouldCallForInput(wheelGenerator, 20);
  });

  it('should call the modified wheel 2 if participant count is 8 modulo 24', () => {
    itShouldCallForInput(wheelModifiedTwoGenerator, 32);
  });

  it('should call the modified wheel 2 if participant count is 16 modulo 24', () => {
    itShouldCallForInput(wheelModifiedTwoGenerator, 16);
  });

  it('should call the modified wheel 3 if participant count is 12 modulo 24', () => {
    itShouldCallForInput(wheelModifiedThreeGenerator, 36);
  });

  it('should call the modified wheel 4 if participant count is 0 modulo 24', () => {
    itShouldCallForInput(wheelModifiedFourGenerator, 24);
  });
});

function itShouldCallForInput(generator: CyclicSeedGenerator, input: number): void {
  cyclicSeedGenerator(input);

  expect(generator).toHaveBeenCalledTimes(1);
  expect(generator).toHaveBeenCalledWith(input);
}
