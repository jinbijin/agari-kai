import { Injectable, computed, inject, signal } from '@angular/core';
import { List, Seq } from 'immutable';
import {
  AgariNotification,
  AgariNotificationDismissAction,
  AgariNotificationDismissTriggers,
} from './notification.types';
import { AGARI_NOTIFICATION_DEFAULT_TIMEOUT } from './notification.token';

export interface AgariNotificationDismissOptions {
  time?: number;
  action?: AgariNotificationDismissAction;
}

@Injectable({
  providedIn: 'root',
})
export class AgariNotificationService {
  readonly #defaultNotificationTimeout = inject(AGARI_NOTIFICATION_DEFAULT_TIMEOUT, { optional: true }) ?? 5000;

  // We follow the usual convention of enqueueing at the back of an array,
  // and dequeueing from the front.
  readonly #queue = signal(List<AgariNotification>());
  readonly #current = signal<AgariNotification | null>(null);
  readonly #undismissed = signal(List<AgariNotification>());
  readonly #expanded = signal(false);

  readonly #currentAsArray = computed(() => {
    const current = this.#current();
    return current != null ? [current] : [];
  });

  readonly notifications = computed<AgariNotification[]>(() => {
    if (this.#expanded()) {
      return Seq<AgariNotification>(this.#undismissed()).reverse().toArray();
    }

    return this.#currentAsArray();
  });
  readonly expanded = this.#expanded.asReadonly();

  #timeout: number | null = null;
  #nextId = 1;

  openNotificationCenter(): void {
    const currentAsArray = this.#currentAsArray();
    const queue = this.#queue();

    this.#cancelTimer();
    this.#current.set(null);
    this.#queue.set(List());
    this.#undismissed.update((undismissed) => undismissed.concat(currentAsArray, queue));
    this.#expanded.set(true);
  }

  closeNotificationCenter(): void {
    this.#expanded.set(false);
  }

  addNotification(message: string, options?: AgariNotificationDismissOptions): void {
    const triggers = this.#computeTriggers(options);
    const id = this.#getNextId();
    const notification: AgariNotification = {
      id,
      message,
      triggers,
    };

    if (this.#expanded()) {
      this.#undismissed.update((undismissed) => undismissed.push(notification));
      return;
    }

    if (this.#current() != null) {
      this.#queue.update((queue) => queue.push(notification));
      return;
    }

    this.#setNextNotification(notification);
  }

  dismissCurrentNotification(dismissedManually: boolean = true): void {
    this.#cancelTimer();

    const current = this.#current();
    if (dismissedManually && current?.triggers?.action?.onClose != null) {
      current.triggers.action.onClose();
    }
    if (!dismissedManually && current != null) {
      this.#undismissed.update((undismissed) => undismissed.push(current));
    }

    const queue = this.#queue();
    const next = queue.first();
    if (next != null) {
      this.#queue.update((queue) => queue.shift());
      this.#setNextNotification(next);
      return;
    }

    this.#current.set(null);
  }

  dismissNotification(reverseIndex: number, callOnClose: boolean = true): void {
    const notifications = this.#undismissed();

    const index = notifications.size - 1 - reverseIndex;
    const notification = notifications.get(index)!;
    if (callOnClose && notification.triggers.action?.onClose) {
      notification.triggers.action.onClose();
    }

    this.#undismissed.update((undismissed) => undismissed.remove(index));
  }

  #computeTriggers(options?: AgariNotificationDismissOptions): AgariNotificationDismissTriggers {
    return options == null || options.action == null
      ? { time: options?.time ?? this.#defaultNotificationTimeout }
      : (options as AgariNotificationDismissTriggers);
  }

  #setNextNotification(notification: AgariNotification): void {
    if (notification.triggers.time != null) {
      this.#timeout = window.setTimeout(() => {
        this.dismissCurrentNotification(false);
      }, notification.triggers.time);
    }

    this.#current.set(notification);
  }

  #cancelTimer(): void {
    if (this.#timeout != null) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }
  }

  #getNextId(): number {
    const nextId = this.#nextId;
    this.#nextId += 1;
    return nextId;
  }
}
