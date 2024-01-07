import { ErrorCode, Result } from '../../common/result';
import { Schedule } from '../schedule';

export class UnsupportedParticipantCountError implements ErrorCode {
  readonly code = 'UnsupportedParticipantCount' as const;

  constructor(readonly participantCount: number) {}

  toString(): string {
    return `This schedule generator does not support generating schedules for ${this.participantCount} participants.`;
  }
}

export class UnsupportedRoundCountError implements ErrorCode {
  readonly code = 'UnsupportedRoundCount' as const;

  constructor(
    readonly participantCount: number,
    readonly roundCount: number,
  ) {}

  toString(): string {
    return `This schedule generator does not support generating schedules with ${this.roundCount} rounds for ${this.participantCount} participants.`;
  }
}

export interface ScheduleGenerator {
  maxRoundCount(participantCount: number): Result<number, UnsupportedParticipantCountError>;

  generate(
    participantCount: number,
    roundCount: number,
  ): Result<Schedule, UnsupportedParticipantCountError | UnsupportedRoundCountError>;
}
