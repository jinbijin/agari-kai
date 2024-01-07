import { Result, err, isErr, ok } from '../../../common/result';
import { Schedule, ScheduleRound, ScheduleTable } from '../../schedule';
import { ScheduleGenerator, UnsupportedParticipantCountError, UnsupportedRoundCountError } from '../schedule.generator';
import { cyclicSeedGenerator } from './cyclic-seed.generator';
import { remEuclid } from '../../../common/rem-euclid';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CyclicGenerator implements ScheduleGenerator {
  maxRoundCount(participantCount: number): Result<number, UnsupportedParticipantCountError> {
    if (participantCount < 16) {
      return err(new UnsupportedParticipantCountError(participantCount));
    }

    switch (participantCount % 48) {
      case 4:
      case 20:
      case 28:
      case 44:
        return ok(participantCount / 4); // Classic wheel
      case 16:
      case 32:
        return ok(participantCount / 4 - 1); // Modified wheel 2 (divisible by 16)
      case 0:
      case 8:
      case 12:
      case 36:
      case 40:
        return ok(participantCount / 4 - 2); // Modified wheel 2 (not divisible by 16), modified wheel 3, modified wheel 4 (divisible by 16)
      case 24:
        return ok(participantCount / 4 - 3); // Modified wheel 4 (not divisible by 16)
    }

    return err(new UnsupportedParticipantCountError(participantCount));
  }

  generate(
    participantCount: number,
    roundCount: number,
  ): Result<Schedule<undefined, undefined>, UnsupportedParticipantCountError | UnsupportedRoundCountError> {
    if (roundCount <= 0) {
      return err(new UnsupportedRoundCountError(participantCount, roundCount));
    }

    const validationResult = this.maxRoundCount(participantCount);
    if (isErr(validationResult)) {
      return validationResult;
    } else if (roundCount > validationResult.value) {
      return err(new UnsupportedRoundCountError(participantCount, roundCount));
    }

    return ok(this.#generateSchedule(participantCount, roundCount));
  }

  #generateSchedule(participantCount: number, roundCount: number): Schedule {
    const tableCount = participantCount / 4;
    const seed = cyclicSeedGenerator(participantCount);
    const items = seed.seed.slice(0, roundCount);

    return {
      participantCount,
      roundCount,
      rounds: [...this.#generateExtraRounds(tableCount), ...this.#generateRounds(tableCount, items)],
    };
  }

  *#generateRounds(tableCount: number, items: [number, number, number][]): Generator<ScheduleRound> {
    for (const item of items) {
      const tables = [...this.#generateTables(tableCount, item)];

      yield {
        tables,
        data: undefined,
      };
    }
  }

  *#generateTables(tableCount: number, item: [number, number, number]): Generator<ScheduleTable> {
    for (let i = 0; i < tableCount; i++) {
      const participants = [
        remEuclid(i, tableCount),
        remEuclid(i + item[0], tableCount) + tableCount,
        remEuclid(i + item[1], tableCount) + 2 * tableCount,
        remEuclid(i + item[2], tableCount) + 3 * tableCount,
      ];

      yield {
        participants,
        data: undefined,
      };
    }
  }

  *#generateExtraRounds(tableCount: number): Generator<ScheduleRound> {
    if (tableCount % 4 === 0) {
      yield {
        tables: [...this.#generateExtraTables(tableCount)],
        data: undefined,
      };
    }
  }

  *#generateExtraTables(tableCount: number): Generator<ScheduleTable> {
    for (let i = 0; i < tableCount; i++) {
      yield {
        participants: [4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3],
        data: undefined,
      };
    }
  }
}
