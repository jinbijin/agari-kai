import { Type } from '@angular/core';
import { Result, err, ignoreOk, isErr, isOk, ok, okValue } from '../../common/result';
import {
  ScheduleGenerator,
  UnsupportedParticipantCountError,
  UnsupportedRoundCountError,
} from '../generator/schedule.generator';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';

export interface ScheduleGeneratorRoundTestCase {
  roundCount: number;
  expectedResult: Result<undefined, UnsupportedParticipantCountError | UnsupportedRoundCountError>;
}

export interface ScheduleGeneratorTestCase {
  participantCount: number;
  expectedMaxRoundCount: Result<number, UnsupportedParticipantCountError>;
  roundCases?: [ScheduleGeneratorRoundTestCase, ...ScheduleGeneratorRoundTestCase[]];
}

const defaultTestCases: ScheduleGeneratorTestCase[] = [
  createInvalidParticipantCountCase(12),
  createInvalidParticipantCountCase(15),
  createInvalidParticipantCountCase(17),
];

export function runScheduleGeneratorSuite(
  generator: Type<ScheduleGenerator>,
  testCases: ScheduleGeneratorTestCase[],
  moduleDef?: TestModuleMetadata,
): void {
  describe(generator.name, () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ ...moduleDef });
    });

    it('should create', () => {
      const instance = TestBed.inject(generator);
      expect(instance).toBeDefined();
    });

    for (const testCase of [...defaultTestCases, ...testCases]) {
      describe(`for ${testCase.participantCount} participants`, () => {
        const testName = isOk(testCase.expectedMaxRoundCount)
          ? `should support ${testCase.expectedMaxRoundCount.value} rounds`
          : `should not support ${testCase.participantCount} participants`;

        it(testName, () => {
          const instance = TestBed.inject(generator);

          const result = instance.maxRoundCount(testCase.participantCount);

          expect(result).toEqual(testCase.expectedMaxRoundCount);
        });

        const defaultRoundCases: ScheduleGeneratorRoundTestCase[] = [
          createInvalidRoundCountCase(testCase.participantCount, -1),
          createInvalidRoundCountCase(testCase.participantCount, 0),
        ];

        if (isOk(testCase.expectedMaxRoundCount)) {
          defaultRoundCases.push(createValidRoundCountCase(testCase.expectedMaxRoundCount.value));
          defaultRoundCases.push(
            createInvalidRoundCountCase(testCase.participantCount, testCase.expectedMaxRoundCount.value + 1),
          );
        } else {
          defaultRoundCases.push(createInvalidRoundParticipantCountCase(testCase.participantCount, 1));
        }

        const testRoundCases = testCase.roundCases ?? [];

        for (const roundCase of [...defaultRoundCases, ...testRoundCases]) {
          describe(`for ${roundCase.roundCount} round${roundCase.roundCount === 1 ? '' : 's'}`, () => {
            if (isErr(roundCase.expectedResult)) {
              it(`should not support ${roundCase.roundCount} round${roundCase.roundCount === 1 ? '' : 's'}`, () => {
                const instance = TestBed.inject(generator);

                const result = instance.generate(testCase.participantCount, roundCase.roundCount);

                expect(ignoreOk(result)).toEqual(roundCase.expectedResult);
              });
            } else {
              it('should generate a schedule', () => {
                const instance = TestBed.inject(generator);

                const result = instance.generate(testCase.participantCount, roundCase.roundCount);

                expect(isOk(result)).toBe(true);
              });

              it(`should generate ${roundCase.roundCount} rounds`, () => {
                const instance = TestBed.inject(generator);

                const result = okValue(instance.generate(testCase.participantCount, roundCase.roundCount));

                expect(result.roundCount).toBe(roundCase.roundCount);
                expect(result.rounds).toHaveLength(roundCase.roundCount);
              });

              it('should have tables of four', () => {
                const instance = TestBed.inject(generator);

                const result = okValue(instance.generate(testCase.participantCount, roundCase.roundCount));

                const tableSizes = result.rounds
                  .flatMap((round) => round.tables)
                  .map((table) => table.participants.length);
                expect(tableSizes).toEqual(expect.arrayContaining([4]));
              });

              it('should contain all participants in every round', () => {
                const expectedSet = new Set(Array(testCase.participantCount).keys());
                const instance = TestBed.inject(generator);

                const result = okValue(instance.generate(testCase.participantCount, roundCase.roundCount));

                for (const round of result.rounds) {
                  const participants = round.tables.flatMap((table) => table.participants);
                  const resultSet = new Set(participants);

                  expect(participants).toHaveLength(expectedSet.size);
                  expect(resultSet).toEqual(expectedSet);
                }
              });

              it('should not have colliding pairs across tables', () => {
                const instance = TestBed.inject(generator);

                const result = okValue(instance.generate(testCase.participantCount, roundCase.roundCount));

                const pairMap = new Map<number, [number, number]>();
                for (let r = 0; r < result.rounds.length; r++) {
                  const round = result.rounds[r];
                  for (let t = 0; t < round.tables.length; t++) {
                    const table = round.tables[t];

                    for (let i = 0; i < table.participants.length; i++) {
                      for (let j = i + 1; j < table.participants.length; j++) {
                        const key = table.participants[i] * 1024 + table.participants[j];
                        const reverseKey = table.participants[j] * 1024 + table.participants[i];

                        expect(pairMap.has(key)).toBe(false);
                        expect(pairMap.has(reverseKey)).toBe(false);

                        pairMap.set(key, [r, t]);
                        pairMap.set(reverseKey, [r, t]);
                      }
                    }
                  }
                }
              });
            }
          });
        }
      });
    }
  });
}

export function createInvalidParticipantCountCase(participantCount: number): ScheduleGeneratorTestCase {
  return {
    participantCount,
    expectedMaxRoundCount: err(new UnsupportedParticipantCountError(participantCount)),
  };
}

export function createValidRoundCountCase(roundCount: number): ScheduleGeneratorRoundTestCase {
  return {
    roundCount,
    expectedResult: ok(undefined),
  };
}

export function createInvalidRoundCountCase(
  participantCount: number,
  roundCount: number,
): ScheduleGeneratorRoundTestCase {
  return {
    roundCount,
    expectedResult: err(new UnsupportedRoundCountError(participantCount, roundCount)),
  };
}

export function createInvalidRoundParticipantCountCase(
  participantCount: number,
  roundCount: number,
): ScheduleGeneratorRoundTestCase {
  return {
    roundCount,
    expectedResult: err(new UnsupportedParticipantCountError(participantCount)),
  };
}
