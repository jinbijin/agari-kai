import { remEuclid } from './rem-euclid';

describe(remEuclid.name, () => {
  it('should compute with zero value and positive modulus', () => {
    expect(remEuclid(0, 3)).toBe(0);
  });

  it('should compute with zero value and negative modulus', () => {
    expect(remEuclid(0, -3)).toBe(0);
  });

  it('should compute with positive value and modulus', () => {
    expect(remEuclid(1, 3)).toBe(1);
  });

  it('should compute with negative value and positive modulus', () => {
    expect(remEuclid(-1, 3)).toBe(2);
  });

  it('should compute with negative value and modulus', () => {
    expect(remEuclid(-1, -3)).toBe(2);
  });

  it('should compute with positive value and negative modulus', () => {
    expect(remEuclid(1, -3)).toBe(1);
  });
});
