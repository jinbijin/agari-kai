import { Component, ElementRef, HostBinding, HostListener, OnInit, inject } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { AgariNotificationService } from './notification.service';

@Component({
  selector: 'agari-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.scss',
  standalone: true,
  imports: [NotificationComponent],
})
export class NotificationCenterComponent implements OnInit {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #notificationService = inject(AgariNotificationService);

  readonly notifications = this.#notificationService.notifications;
  readonly expanded = this.#notificationService.expanded;

  @HostBinding('class.expanded')
  get expandedClass(): boolean {
    return this.expanded();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent): void {
    if (event.target == null || !this.#elementRef.nativeElement.contains(event.target as Node)) {
      this.#notificationService.closeNotificationCenter();
    }
  }

  ngOnInit(): void {
    this.#elementRef.nativeElement.showPopover();
  }

  dismiss(index: number, actionTriggered: boolean): void {
    if (this.expanded()) {
      this.#notificationService.dismissNotification(index, actionTriggered);
    } else {
      this.#notificationService.dismissCurrentNotification();
    }
  }
}
