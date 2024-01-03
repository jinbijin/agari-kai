import { Component, inject } from '@angular/core';
import { AgariNotificationService } from '../notification/notification.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[agariHeader]',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class AgariHeaderComponent {
  readonly #notificationService = inject(AgariNotificationService);

  openNotificationCenter(): void {
    this.#notificationService.openNotificationCenter();
  }
}
