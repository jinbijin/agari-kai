import { TestBed } from '@angular/core/testing';
import { AGARI_SCHEDULE_GENERATORS } from './schedule-generator.token';
import { ScheduleGeneratorFactory } from './schedule-generator-factory.service';
import { UnsupportedParticipantCountError } from './schedule.generator';
import { Result, err, ok } from '../../common/result';

describe('ScheduleGeneratorFactory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AGARI_SCHEDULE_GENERATORS,
          useValue: [
            new GenericScheduleGenerator(),
            new SpecificBetterScheduleGenerator(),
            new SpecificWorseScheduleGenerator(),
          ],
        },
      ],
    });
  });

  it('should create', () => {
    const factory = TestBed.inject(ScheduleGeneratorFactory);
    expect(factory).toBeDefined();
  });

  it('should return error if no generator is applicable', () => {
    const factory = TestBed.inject(ScheduleGeneratorFactory);
    const participantCount = 12;

    const result = factory.create(participantCount);

    expect(result).toEqual(err(new UnsupportedParticipantCountError(participantCount)));
  });

  it('should return the unique applicable generator', () => {
    const factory = TestBed.inject(ScheduleGeneratorFactory);
    const participantCount = 24;

    const result = factory.create(participantCount);

    expect(result).toEqual(ok(new GenericScheduleGenerator()));
  });

  it('should return the applicable generator which has a higher max round count - specific over generic', () => {
    const factory = TestBed.inject(ScheduleGeneratorFactory);
    const participantCount = 16;

    const result = factory.create(participantCount);

    expect(result).toEqual(ok(new SpecificBetterScheduleGenerator()));
  });

  it('should return the applicable generator which has a higher max round count - generic over specific', () => {
    const factory = TestBed.inject(ScheduleGeneratorFactory);
    const participantCount = 20;

    const result = factory.create(participantCount);

    expect(result).toEqual(ok(new GenericScheduleGenerator()));
  });
});

class GenericScheduleGenerator {
  maxRoundCount(participantCount: number): Result<number, UnsupportedParticipantCountError> {
    return participantCount >= 16 ? ok(4) : err(new UnsupportedParticipantCountError(participantCount));
  }
}

class SpecificBetterScheduleGenerator {
  maxRoundCount(participantCount: number): Result<number, UnsupportedParticipantCountError> {
    return participantCount == 16 ? ok(5) : err(new UnsupportedParticipantCountError(participantCount));
  }
}

class SpecificWorseScheduleGenerator {
  maxRoundCount(participantCount: number): Result<number, UnsupportedParticipantCountError> {
    return participantCount == 20 ? ok(3) : err(new UnsupportedParticipantCountError(participantCount));
  }
}
