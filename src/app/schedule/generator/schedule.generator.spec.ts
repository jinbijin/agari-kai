import { ResultUnwrapError, err, okValue } from '../../common/result';
import { UnsupportedParticipantCountError, UnsupportedRoundCountError } from './schedule.generator';

describe('UnsupportedParticipantCountError', () => {
  it('should throw', () => {
    const result = err(new UnsupportedParticipantCountError(16));

    expect(() => okValue(result)).toThrow(ResultUnwrapError);
  });
});

describe('UnsupportedRoundCountError', () => {
  it('should throw', () => {
    const result = err(new UnsupportedRoundCountError(16, 5));

    expect(() => okValue(result)).toThrow(ResultUnwrapError);
  });
});
