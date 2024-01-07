import { range } from './range';

describe(range.name, () => {
  it('should create range', () => {
    expect([...range(3, 8)]).toEqual([3, 4, 5, 6, 7]);
  });
});
