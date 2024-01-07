import { Injectable, inject } from '@angular/core';
import { ScheduleGenerator, UnsupportedParticipantCountError } from './schedule.generator';
import { AGARI_SCHEDULE_GENERATORS } from './schedule-generator.token';
import { Result, err, isOk, ok } from '../../common/result';

@Injectable({
  providedIn: 'root',
})
export class ScheduleGeneratorFactory {
  readonly #generators = inject(AGARI_SCHEDULE_GENERATORS);

  create(participantCount: number): Result<ScheduleGenerator, UnsupportedParticipantCountError> {
    let result: ScheduleGenerator | undefined = undefined;
    let max: number | undefined = undefined;

    for (const generator of this.#generators) {
      const maxRoundCount = generator.maxRoundCount(participantCount);
      if (isOk(maxRoundCount) && (!max || maxRoundCount.value > max)) {
        result = generator;
        max = maxRoundCount.value;
      }
    }

    return result != null ? ok(result) : err(new UnsupportedParticipantCountError(participantCount));
  }
}
