import { Component } from '@angular/core';
import {
  AgariValidationMessageCollection,
  ValidationMessageConfig,
  provideValidationMessages,
} from './validation-message-collection.service';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe(AgariValidationMessageCollection.name, () => {
  it('should create', () => {
    const service = TestBed.inject(AgariValidationMessageCollection);

    expect(service).toBeDefined();
  });

  it('should create nested', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement.injector.get(AgariValidationMessageCollection, undefined, { self: true });

    expect(service).toBeDefined();
  });

  it('should find message', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement.injector.get(AgariValidationMessageCollection, undefined, { self: true });

    const result = service.validationMessage({ required: true });

    expect(result).toBe('This field is required.');
  });

  it('should fall back on default message', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement.injector.get(AgariValidationMessageCollection, undefined, { self: true });

    const result = service.validationMessage({ other: true });

    expect(result).toBe('Unexpected error.');
  });

  it('should prioritize message', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement.injector.get(AgariValidationMessageCollection, undefined, { self: true });

    const result = service.validationMessage({ required: true, min: 5 });

    expect(result).toBe('This field is required.');
  });

  it('should find overridden message', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement
      .query(By.directive(InnerComponent))
      .injector.get(AgariValidationMessageCollection, undefined, { self: true });

    const result = service.validationMessage({ required: true });

    expect(result).toBe('Please enter a value.');
  });

  it('should find parent message', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement
      .query(By.directive(InnerComponent))
      .injector.get(AgariValidationMessageCollection, undefined, { self: true });

    const result = service.validationMessage({ min: 5 });

    expect(result).toBe('Value is too small.');
  });

  it('should keep parent message priority', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const service = fixture.debugElement
      .query(By.directive(InnerComponent))
      .injector.get(AgariValidationMessageCollection, undefined, { self: true });

    const result = service.validationMessage({ required: true, min: 5 });

    expect(result).toBe('Please enter a value.');
  });
});

@Component({
  selector: 'agari-inner-component',
  template: '',
  providers: [
    provideValidationMessages(
      new ValidationMessageConfig('required', () => 'Please enter a value.'),
      new ValidationMessageConfig('max', () => 'Value is too large.'),
    ),
  ],
  standalone: true,
})
class InnerComponent {}

@Component({
  selector: 'agari-outer-component',
  template: '<agari-inner-component />',
  providers: [
    provideValidationMessages(
      new ValidationMessageConfig('required', () => 'This field is required.'),
      new ValidationMessageConfig('min', () => 'Value is too small.'),
    ),
  ],
  standalone: true,
  imports: [InnerComponent],
})
class TestComponent {}
