import { TestBed } from '@angular/core/testing';
import { AGARI_SCHEDULE_GENERATORS } from './schedule-generator.token';

describe('AGARI_SCHEDULE_GENERATORS', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    const generators = TestBed.inject(AGARI_SCHEDULE_GENERATORS);
    expect(generators).toBeDefined();
  });

  it('should contain at least one generator', () => {
    const generators = TestBed.inject(AGARI_SCHEDULE_GENERATORS);
    expect(generators.length).toBeGreaterThanOrEqual(1);
  });
});
