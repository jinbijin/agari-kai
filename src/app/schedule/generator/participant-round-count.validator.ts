import { inject } from '@angular/core';
import { ScheduleGeneratorFactory } from './schedule-generator-factory.service';
import { asValidationErrors, isOk, okValue } from 'src/app/common/result';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ScheduleParameters } from '../schedule';

export function participantRoundCountValidator(): ValidatorFn {
  const factory = inject(ScheduleGeneratorFactory);

  return (control: AbstractControl<ScheduleParameters>) => {
    const value = control.value;
    const generatorResult = factory.create(value.participantCount);

    if (!isOk(generatorResult)) {
      return asValidationErrors(generatorResult);
    }

    const roundCount = okValue(generatorResult.value.maxRoundCount(value.participantCount));

    return value.roundCount > roundCount ? { maxSupported: roundCount } : null;
  };
}
