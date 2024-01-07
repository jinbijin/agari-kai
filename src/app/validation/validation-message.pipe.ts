import { Pipe, PipeTransform, inject } from '@angular/core';
import { AgariValidationMessageCollection } from './validation-message-collection.service';

@Pipe({
  name: 'agariValidationMessage',
  standalone: true,
})
export class ValidationMessagePipe implements PipeTransform {
  readonly #validationMessageCollection = inject(AgariValidationMessageCollection);

  transform(value: Record<string, unknown>): string {
    return this.#validationMessageCollection.validationMessage(value);
  }
}
