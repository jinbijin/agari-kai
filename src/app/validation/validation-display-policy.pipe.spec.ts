import { Component, DebugElement, Type } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationDisplayPolicyPipe } from './validation-display-policy.pipe';
import { ValidationMessagePipe } from './validation-message.pipe';
import { ValidationMessageConfig, provideValidationMessages } from './validation-message-collection.service';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

function runSuite(description: string, component: Type<TestComponent>): void {
  describe(description, () => {
    it('should create', () => {
      const fixture = TestBed.createComponent(component);

      expect(fixture.componentInstance).toBeDefined();
    });

    it('should display child error', fakeAsync(() => {
      const fixture = initializeComponent(component);

      const childError = childErrorElement(fixture);
      expect(childError.nativeElement.textContent).toBe('This field is required.');
    }));

    it('should not display parent error if child is invalid', fakeAsync(() => {
      const fixture = initializeComponent(component);

      const parentError = parentErrorElement(fixture);
      expect(parentError).toBe(null);
    }));

    it('should not display child error if child is valid', fakeAsync(() => {
      const fixture = initializeComponent(component, 0);

      const childError = childErrorElement(fixture);
      expect(childError).toBe(null);
    }));

    it('should display parent error if child is valid', fakeAsync(() => {
      const fixture = initializeComponent(component, 0);

      const parentError = parentErrorElement(fixture);
      expect(parentError.nativeElement.textContent).toBe('This field is required.');
    }));

    it('should not display child error if both are valid', fakeAsync(() => {
      const fixture = initializeComponent(component, 1);

      const childError = childErrorElement(fixture);
      expect(childError).toBe(null);
    }));

    it('should not display parent error if both are valid', fakeAsync(() => {
      const fixture = initializeComponent(component, 1);

      const parentError = parentErrorElement(fixture);
      expect(parentError).toBe(null);
    }));
  });
}

@Component({
  selector: 'agari-array-test',
  template: `
    <form [formGroup]="form">
      @if ((form.controls[0] | agariValidationDisplayPolicy)(); as errors) {
        <span role="alert" data-test-id="child-error">{{ errors | agariValidationMessage }}</span>
      }
      @if ((form | agariValidationDisplayPolicy)(); as formErrors) {
        <span role="alert" data-test-id="parent-error">{{ formErrors | agariValidationMessage }}</span>
      }
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ValidationDisplayPolicyPipe, ValidationMessagePipe],
  providers: [provideValidationMessages(new ValidationMessageConfig('required', () => 'This field is required.'))],
})
class ArrayTestComponent implements TestComponent {
  form = new FormArray(
    [new FormControl<number | null>(null, [Validators.required])],
    [(control) => (control.value[0] === 0 || control.value[0] === null ? { required: true } : null)],
  );

  setValue(value: number | null): void {
    this.form.controls[0].setValue(value);
  }
}

@Component({
  selector: 'agari-group-test',
  template: `
    <form [formGroup]="form">
      @if ((form.controls.child | agariValidationDisplayPolicy)(); as errors) {
        <span role="alert" data-test-id="child-error">{{ errors | agariValidationMessage }}</span>
      }
      @if ((form | agariValidationDisplayPolicy)(); as formErrors) {
        <span role="alert" data-test-id="parent-error">{{ formErrors | agariValidationMessage }}</span>
      }
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ValidationDisplayPolicyPipe, ValidationMessagePipe],
  providers: [provideValidationMessages(new ValidationMessageConfig('required', () => 'This field is required.'))],
})
class GroupTestComponent implements TestComponent {
  form = new FormGroup(
    {
      child: new FormControl<number | null>(null, [Validators.required]),
    },
    [(control) => (control.value.child === 0 || control.value.child === null ? { required: true } : null)],
  );

  setValue(value: number | null): void {
    this.form.controls.child.setValue(value);
  }
}

describe(ValidationDisplayPolicyPipe.name, () => {
  runSuite('with FormGroup', GroupTestComponent);
  runSuite('with FormArray', ArrayTestComponent);
});

function childErrorElement(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.css('[data-test-id="child-error"]'));
}

function parentErrorElement(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.css('[data-test-id="parent-error"]'));
}

interface TestComponent {
  setValue(value: number | null): void;
}

function initializeComponent<C extends TestComponent>(
  component: Type<C>,
  value: number | null = null,
): ComponentFixture<C> {
  const fixture = TestBed.createComponent(component);
  fixture.componentInstance.setValue(value);
  fixture.detectChanges();
  tick();
  fixture.detectChanges();

  return fixture;
}
