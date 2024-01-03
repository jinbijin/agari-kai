import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AgariNotificationService } from '../notification/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';

interface VersionData {
  version: string;
}

const UPDATE_NOTIFICATION_TIMEOUT = 15000;

@Injectable({
  providedIn: 'root',
})
export class InstallerService {
  readonly #swUpdate = inject(SwUpdate);
  readonly #notificationService = inject(AgariNotificationService);
  readonly #document = inject(DOCUMENT);

  constructor() {
    this.#swUpdate.versionUpdates.pipe(takeUntilDestroyed()).subscribe((event) => {
      switch (event.type) {
        case 'VERSION_READY': {
          const latestVersionData = event.latestVersion.appData as VersionData;
          this.#notificationService.addNotification(
            `Update to ${latestVersionData.version} installed. Reload the application to apply the update.`,
            {
              time: UPDATE_NOTIFICATION_TIMEOUT,
              action: {
                label: 'Reload now',
                onClose:
                  /* istanbul ignore next */
                  () => {
                    this.#document.location.reload();
                  },
              },
            },
          );
          break;
        }
        case 'VERSION_DETECTED': {
          this.#notificationService.addNotification(`New update available. Installing...`);
          break;
        }
        case 'VERSION_INSTALLATION_FAILED': {
          this.#notificationService.addNotification('Update failed.', {
            time: UPDATE_NOTIFICATION_TIMEOUT,
            action: {
              label: 'Try again',
              onClose: () => {
                this.#swUpdate.checkForUpdate();
              },
            },
          });
          break;
        }
      }
    });
  }
}
