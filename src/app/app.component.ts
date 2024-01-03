import { Component, inject } from '@angular/core';
import { NotificationCenterComponent } from './core/notification/notification-center.component';
import { InstallerService } from './core/installer/installer.service';
import { AgariHeaderComponent } from './core/header/header.component';

@Component({
  selector: 'agari-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AgariHeaderComponent, NotificationCenterComponent],
})
export class AppComponent {
  constructor() {
    inject(InstallerService);
  }
}
