import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const resultBrand = Symbol('agari-result');

export interface ErrorCode {
  code: string;
  toString(): string;
}

export interface Ok<T> {
  [resultBrand]: 'ok';
  value: T;
}

export interface Err<E extends ErrorCode> {
  [resultBrand]: 'error';
  error: E;
}

export class ResultUnwrapError<E extends ErrorCode> extends Error {
  constructor(readonly err: E) {
    super();
    this.message = `Unexpected error ${err.code} while unwrapping a result: ${err.toString()}`;
    this.cause = err;
    this.name = 'ResultUnwrapError';

    if ('captureStackTrace' in Error && Error.captureStackTrace instanceof Function) {
      Error.captureStackTrace(this, ResultUnwrapError);
    }
  }
}

export type Result<T, E extends ErrorCode> = Ok<T> | Err<E>;

export function ok<T, E extends ErrorCode = ErrorCode>(value: T): Result<T, E> {
  return {
    [resultBrand]: 'ok',
    value,
  };
}

export function err<E extends ErrorCode, T = unknown>(error: E): Result<T, E> {
  return {
    [resultBrand]: 'error',
    error,
  };
}

export function isOk<T, E extends ErrorCode>(result: Result<T, E>): result is Ok<T> {
  return result[resultBrand] === 'ok';
}

export function isErr<T, E extends ErrorCode>(result: Result<T, E>): result is Err<E> {
  return result[resultBrand] === 'error';
}

export function okValue<T, E extends ErrorCode>(result: Result<T, E>): T {
  if (!isOk(result)) {
    throw new ResultUnwrapError(result.error);
  }

  return result.value;
}

export function then<T, E extends ErrorCode, T2, E2 extends ErrorCode>(
  result: Result<T, E>,
  fn: (value: T) => Result<T2, E2>,
): Result<T2, E | E2> {
  if (!isOk(result)) {
    return result;
  }

  return fn(result.value);
}

export function ignoreOk<T, E extends ErrorCode>(result: Result<T, E>): Result<undefined, E> {
  return isOk(result) ? ok(undefined) : result;
}

export function asValidatorFn<A, T, E extends ErrorCode>(resultFn: (arg: A) => Result<T, E>): ValidatorFn {
  return (control: AbstractControl<A>) => {
    if (!control.value) {
      return null;
    }

    return asValidationErrors(resultFn(control.value));
  };
}

export function asValidationErrors<T, E extends ErrorCode>(result: Result<T, E>): ValidationErrors | null {
  return isOk(result) ? null : { [result.error.code]: result.error };
}
