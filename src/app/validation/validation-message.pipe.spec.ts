import { Component } from '@angular/core';
import { ValidationMessagePipe } from './validation-message.pipe';
import { ValidationMessageConfig, provideValidationMessages } from './validation-message-collection.service';
import { TestBed } from '@angular/core/testing';

describe(ValidationMessagePipe.name, () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);

    expect(fixture.componentInstance).toBeDefined();
  });

  it('should display error', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe('This field is required.');
  });
});

@Component({
  selector: 'agari-test',
  template: '{{ errors | agariValidationMessage }}',
  standalone: true,
  imports: [ValidationMessagePipe],
  providers: [provideValidationMessages(new ValidationMessageConfig('required', () => 'This field is required.'))],
})
class TestComponent {
  errors = { required: true };
}
