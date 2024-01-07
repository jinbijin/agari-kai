import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScheduleInputComponent } from './schedule-input.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe(ScheduleInputComponent.name, () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(ScheduleInputComponent);

    expect(fixture.componentInstance).toBeDefined();
  });

  it('should be valid initially', () => {
    const fixture = TestBed.createComponent(ScheduleInputComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.status).toBe('VALID');
  });

  it('should submit', () => {
    let value;
    const fixture = TestBed.createComponent(ScheduleInputComponent);
    fixture.componentInstance.inputSubmitted.subscribe((x) => (value = x));
    fixture.detectChanges();

    submit(fixture);

    expect(value).toEqual({ participantCount: 16, roundCount: 3 });
  });

  it('should not submit an invalid value', fakeAsync(() => {
    let value;
    const fixture = TestBed.createComponent(ScheduleInputComponent);
    fixture.componentInstance.inputSubmitted.subscribe((x) => (value = x));
    fixture.detectChanges();

    const participantField = formField(fixture, 'participant-count');
    setInput(fixture, participantField, '12');

    submit(fixture);

    expect(value).toBeUndefined();
  }));

  it('should invalidate on input of participant count', fakeAsync(() => {
    const fixture = TestBed.createComponent(ScheduleInputComponent);
    fixture.detectChanges();

    const participantField = formField(fixture, 'participant-count');
    setInput(fixture, participantField, '12');

    const participantFieldValidation = formFieldValidation(participantField);
    expect(participantFieldValidation?.nativeElement.textContent).toBe('Enter a multiple of 4 that is at least 16.');
  }));

  it('should invalidate on input of too high of a round count', fakeAsync(() => {
    const fixture = TestBed.createComponent(ScheduleInputComponent);
    fixture.detectChanges();

    const roundField = formField(fixture, 'round-count');
    setInput(fixture, roundField, '7');

    const roundFieldValidation = formFieldValidation(roundField);
    expect(roundFieldValidation?.nativeElement.textContent).toBe('Lower the number of rounds.');
  }));

  it('should invalidate on input of too low of a round count', fakeAsync(() => {
    const fixture = TestBed.createComponent(ScheduleInputComponent);
    fixture.detectChanges();

    const roundField = formField(fixture, 'round-count');
    setInput(fixture, roundField, '-1');

    const roundFieldValidation = formFieldValidation(roundField);
    expect(roundFieldValidation?.nativeElement.textContent).toBe('Enter a number that is at least 1.');
  }));
});

function formField(fixture: ComponentFixture<ScheduleInputComponent>, id: string): DebugElement {
  return fixture.debugElement.query(By.css(`label[data-test-id="${id}"]`));
}

function setInput(fixture: ComponentFixture<ScheduleInputComponent>, element: DebugElement, value: string): void {
  const inputElement = element.query(By.css('input'));
  inputElement.nativeElement.value = value;
  inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
}

function formFieldValidation(element: DebugElement): DebugElement | null {
  return element.query(By.css('[role="alert"]'));
}

function submit(fixture: ComponentFixture<ScheduleInputComponent>): void {
  fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement.click();
  fixture.detectChanges();
}
