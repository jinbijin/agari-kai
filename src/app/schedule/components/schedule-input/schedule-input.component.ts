import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { ScheduleParameters } from '../../schedule';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { participantCountValidator } from '../../generator/participant-count.validator';
import { ValidationMessagePipe } from 'src/app/validation/validation-message.pipe';
import { ValidationDisplayPolicyPipe } from 'src/app/validation/validation-display-policy.pipe';
import { provideValidationMessages } from 'src/app/validation/validation-message-collection.service';
import { participantRoundCountValidator } from '../../generator/participant-round-count.validator';

@Component({
  selector: 'agari-schedule-input',
  templateUrl: './schedule-input.component.html',
  styleUrl: './schedule-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, ValidationMessagePipe, ValidationDisplayPolicyPipe],
  providers: [
    provideValidationMessages(
      {
        key: 'UnsupportedParticipantCount',
        message: () => 'Enter a multiple of 4 that is at least 16.',
      },
      {
        key: 'maxSupported',
        message: () => 'Lower the number of rounds.',
      },
      {
        key: 'min',
        message: () => 'Enter a number that is at least 1.',
      },
    ),
  ],
})
export class ScheduleInputComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);

  readonly form = this.#formBuilder.group(
    {
      participantCount: this.#formBuilder.control(16, {
        validators: [Validators.required, participantCountValidator()],
      }),
      roundCount: this.#formBuilder.control(3, { validators: [Validators.required, Validators.min(1)] }),
    },
    { validators: [participantRoundCountValidator()] },
  );

  @Output() readonly inputSubmitted = new EventEmitter<ScheduleParameters>();

  onSubmit(): void {
    if (this.form.valid) {
      this.inputSubmitted.emit(this.form.value as ScheduleParameters);
    }
  }
}
