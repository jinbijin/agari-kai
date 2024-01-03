import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgariNotification } from './notification.types';

@Component({
  selector: 'agari-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  standalone: true,
})
export class NotificationComponent {
  @Input({ required: true }) notification!: AgariNotification;
  @Input({ required: true }) showDismiss!: boolean;
  @Output() actionTriggered = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();
}
