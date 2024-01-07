import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ScheduleInputComponent } from '../components/schedule-input/schedule-input.component';
import { ScheduleComponent } from '../components/schedule/schedule.component';
import { Schedule, ScheduleParameters } from '../schedule';
import { ScheduleGeneratorFactory } from '../generator/schedule-generator-factory.service';
import { okValue } from '../../common/result';

@Component({
  selector: 'agari-schedule-generator-page',
  templateUrl: './schedule-generator.page.component.html',
  styleUrl: './schedule-generator.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ScheduleInputComponent, ScheduleComponent],
})
export class ScheduleGeneratorPageComponent {
  readonly #scheduleGeneratorFactory = inject(ScheduleGeneratorFactory);

  readonly schedule = signal<Schedule | undefined>(undefined);

  onScheduleSubmit(parameters: ScheduleParameters): void {
    const scheduler = okValue(this.#scheduleGeneratorFactory.create(parameters.participantCount));
    const schedule = okValue(scheduler.generate(parameters.participantCount, parameters.roundCount));
    this.schedule.set(schedule);
  }
}
