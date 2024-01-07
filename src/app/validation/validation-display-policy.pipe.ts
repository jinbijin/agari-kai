import { InjectionToken, Pipe, PipeTransform, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

const AGARI_VALIDATION_DISPLAY_POLICY = new InjectionToken<(control: AbstractControl) => ValidationErrors | null>(
  'agari-validation-display-policy',
  {
    providedIn: 'root',
    factory: () => (control) => {
      if (!control.errors) {
        return null;
      }

      const controls = children(control);
      if (controls.some((c) => c.invalid)) {
        return null;
      }

      return control.errors;
    },
  },
);

function children(control: AbstractControl): AbstractControl[] {
  if (control instanceof FormArray) {
    return control.controls;
  }

  if (control instanceof FormGroup) {
    return Object.values(control.controls);
  }

  return [];
}

@Pipe({
  name: 'agariValidationDisplayPolicy',
  standalone: true,
})
export class ValidationDisplayPolicyPipe implements PipeTransform {
  readonly #policy = inject(AGARI_VALIDATION_DISPLAY_POLICY);
  readonly #control = new BehaviorSubject<AbstractControl | undefined>(undefined);
  readonly #validationErrors = toSignal(
    this.#control.pipe(
      distinctUntilChanged(),
      switchMap((c) =>
        c
          ? c.valueChanges.pipe(
              map(/* istanbul ignore next */ () => null),
              startWith(null),
              map(() => this.#policy(c)),
            )
          : of(null),
      ),
    ),
    { initialValue: null },
  );

  transform(control: AbstractControl): Signal<ValidationErrors | null> {
    setTimeout(() => this.#control.next(control));
    return this.#validationErrors;
  }
}
