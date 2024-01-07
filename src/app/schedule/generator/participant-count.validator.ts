import { inject } from '@angular/core';
import { ScheduleGeneratorFactory } from './schedule-generator-factory.service';
import { asValidatorFn } from 'src/app/common/result';
import { ValidatorFn } from '@angular/forms';

export function participantCountValidator(): ValidatorFn {
  const factory = inject(ScheduleGeneratorFactory);

  return asValidatorFn((participantCount: number) => factory.create(participantCount));
}
