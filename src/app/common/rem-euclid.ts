export function remEuclid(value: number, modulo: number): number {
  const absModulo = Math.abs(modulo);

  // Force result to be non-negative without branching
  return ((value % absModulo) + absModulo) % absModulo;
}
