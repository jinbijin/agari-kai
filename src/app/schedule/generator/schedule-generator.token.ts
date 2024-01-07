import { InjectionToken, inject } from '@angular/core';
import { ScheduleGenerator } from './schedule.generator';
import { CyclicGenerator } from './cyclic/cyclic-generator.service';

export const AGARI_SCHEDULE_GENERATORS = new InjectionToken<ScheduleGenerator[]>('agari-schedule-generator', {
  providedIn: 'root',
  factory: () => [inject(CyclicGenerator)],
});
