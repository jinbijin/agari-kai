import { FormControl } from '@angular/forms';
import {
  asValidationErrors,
  asValidatorFn,
  err,
  ErrorCode,
  ignoreOk,
  isErr,
  isOk,
  ok,
  okValue,
  ResultUnwrapError,
  then,
} from './result';

describe('Result', () => {
  describe('ok', () => {
    it('should create', () => {
      const result = ok(1);
      expect(result).toBeDefined();
    });

    it('should be ok', () => {
      const result = ok(1);
      expect(isOk(result)).toBe(true);
    });

    it('should not be error', () => {
      const result = ok(1);
      expect(isErr(result)).toBe(false);
    });

    it('should get value', () => {
      const result = ok(1);
      expect(okValue(result)).toBe(1);
    });

    it('should have value ignored by ignoreOk', () => {
      const result = ok(1);
      expect(ignoreOk(result)).toEqual(ok(undefined));
    });

    it('should compose with ok', () => {
      const result = ok(1);
      const otherResult = ok(2);

      const thenResult = then(result, () => otherResult);

      expect(thenResult).toEqual(ok(2));
    });

    it('should compose with err', () => {
      const result = ok(1);
      const otherResult = err(new TestError());

      const thenResult = then(result, () => otherResult);

      expect(thenResult).toEqual(err(new TestError()));
    });

    it('should be null as validation result', () => {
      const result = ok(1);
      expect(asValidationErrors(result)).toBe(null);
    });

    it('should be null as validation result via control', () => {
      const control = new FormControl(1);
      const validator = () => ok(1);

      expect(asValidatorFn(validator)(control)).toBe(null);
    });
  });

  describe('err', () => {
    it('should create', () => {
      const result = err(new TestError());
      expect(result).toBeDefined();
    });

    it('should not be ok', () => {
      const result = err(new TestError());
      expect(isOk(result)).toBe(false);
    });

    it('should be error', () => {
      const result = err(new TestError());
      expect(isErr(result)).toBe(true);
    });

    it('should throw on value', () => {
      const result = err(new TestError());
      expect(() => okValue(result)).toThrow(ResultUnwrapError);
    });

    it('should have error preserved by ignoreOk', () => {
      const result = err(new TestError());
      expect(ignoreOk(result)).toEqual(err(new TestError()));
    });

    it('should compose', () => {
      const result = err(new TestError());
      const otherResult = ok(1);

      const thenResult = then(result, () => otherResult);

      expect(thenResult).toEqual(err(new TestError()));
    });

    it('should be error as validation result', () => {
      const result = err(new TestError());
      expect(asValidationErrors(result)).toEqual({ ['Test']: new TestError() });
    });

    it('should be error as validation result via control', () => {
      const control = new FormControl(1);
      const validator = () => err(new TestError());

      expect(asValidatorFn(validator)(control)).toEqual({ ['Test']: new TestError() });
    });

    it('should be null as validation result via empty control', () => {
      const control = new FormControl(null);
      const validator = () => err(new TestError());

      expect(asValidatorFn(validator)(control)).toBe(null);
    });
  });
});

class TestError implements ErrorCode {
  readonly code = 'Test';

  toString(): string {
    return 'Test error';
  }
}
