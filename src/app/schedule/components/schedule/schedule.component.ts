import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { Schedule } from '../../schedule';
import { range } from '../../../common/range';

@Component({
  selector: 'agari-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ScheduleComponent {
  #schedule = signal<Schedule>(undefined!);
  @Input({ required: true }) set schedule(value: Schedule) {
    this.#schedule.set(value);
  }
  get schedule(): Schedule {
    return this.#schedule();
  }

  readonly tableIndices = computed(() => {
    const schedule = this.#schedule();
    return [...range(0, schedule.participantCount / 4)];
  });

  readonly seatIndices = [0, 1, 2, 3];
}
