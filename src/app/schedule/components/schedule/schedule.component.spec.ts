import { TestBed } from '@angular/core/testing';
import { ScheduleComponent } from './schedule.component';

describe(ScheduleComponent.name, () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(ScheduleComponent);
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should initialize', () => {
    const fixture = TestBed.createComponent(ScheduleComponent);
    fixture.componentInstance.schedule = {
      participantCount: 16,
      roundCount: 1,
      rounds: [
        {
          tables: [
            { participants: [0, 1, 2, 3], data: undefined },
            { participants: [4, 5, 6, 7], data: undefined },
            { participants: [8, 9, 10, 11], data: undefined },
            { participants: [12, 13, 14, 15], data: undefined },
          ],
          data: undefined,
        },
      ],
    };
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeDefined();
  });
});
