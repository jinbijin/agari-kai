export function* range(from: number, to: number): Generator<number> {
  for (let i = from; i < to; i++) {
    yield i;
  }
}
