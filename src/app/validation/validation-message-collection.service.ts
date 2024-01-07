import { Injectable, InjectionToken, Provider, inject } from '@angular/core';
import { OrderedMap } from 'immutable';

export class ValidationMessageConfig<E = unknown> {
  constructor(
    readonly key: string,
    readonly message: (err: E) => string,
  ) {}
}

const AGARI_VALIDATION_MESSAGE_TOKEN = new InjectionToken<ValidationMessageConfig[]>('agari-validation-message-token');

@Injectable({ providedIn: 'root' })
export class AgariValidationMessageCollection {
  readonly #parentCollection = inject(AgariValidationMessageCollection, { skipSelf: true, optional: true });
  readonly #selfCollection = inject(AGARI_VALIDATION_MESSAGE_TOKEN, { self: true, optional: true });

  readonly messages: OrderedMap<string, (err: unknown) => string>;

  constructor() {
    const parentMessages = this.#parentCollection?.messages ?? OrderedMap();
    const selfMessages = this.#selfCollection ?? [];

    this.messages = parentMessages.withMutations((x) => {
      for (const selfMessage of selfMessages) {
        x.set(selfMessage.key, selfMessage.message);
      }
    });
  }

  validationMessage(errors: Record<string, unknown>): string {
    return this.messages
      .toSeq()
      .filter((_, k) => k in errors)
      .map((v, k) => v(errors[k]))
      .first('Unexpected error.');
  }
}

export function provideValidationMessages(...configs: ValidationMessageConfig[]): Provider {
  return [{ provide: AGARI_VALIDATION_MESSAGE_TOKEN, useValue: configs }, AgariValidationMessageCollection];
}
