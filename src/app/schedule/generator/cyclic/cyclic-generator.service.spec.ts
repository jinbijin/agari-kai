import { ok } from '../../../common/result';
import { ScheduleGeneratorTestCase, runScheduleGeneratorSuite } from '../../testing/schedule-generator.suite';
import { CyclicGenerator } from './cyclic-generator.service';

const testCases: ScheduleGeneratorTestCase[] = [
  {
    participantCount: 16,
    expectedMaxRoundCount: ok(3),
  },
  {
    participantCount: 20,
    expectedMaxRoundCount: ok(5),
  },
  {
    participantCount: 24,
    expectedMaxRoundCount: ok(3),
  },
  {
    participantCount: 28,
    expectedMaxRoundCount: ok(7),
  },
  {
    participantCount: 32,
    expectedMaxRoundCount: ok(7),
  },
  {
    participantCount: 36,
    expectedMaxRoundCount: ok(7),
  },
  {
    participantCount: 40,
    expectedMaxRoundCount: ok(8),
  },
  {
    participantCount: 44,
    expectedMaxRoundCount: ok(11),
  },
  {
    participantCount: 48,
    expectedMaxRoundCount: ok(10),
  },
  {
    participantCount: 52,
    expectedMaxRoundCount: ok(13),
  },
  {
    participantCount: 56,
    expectedMaxRoundCount: ok(12),
  },
  {
    participantCount: 60,
    expectedMaxRoundCount: ok(13),
  },
];

runScheduleGeneratorSuite(CyclicGenerator, testCases);
