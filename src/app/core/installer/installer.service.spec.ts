import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { AgariNotificationDismissOptions, AgariNotificationService } from '../notification/notification.service';
import { InstallerService } from './installer.service';

describe('InstallerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SwUpdateStub,
        { provide: SwUpdate, useExisting: SwUpdateStub },
        AgariNotificationServiceStub,
        { provide: AgariNotificationService, useExisting: AgariNotificationServiceStub },
      ],
    });
  });

  it('should create', () => {
    const service = TestBed.inject(InstallerService);

    expect(service).toBeDefined();
  });

  it('should not display notification if no new version is detected', () => {
    const swUpdateStub = TestBed.inject(SwUpdateStub);
    swUpdateStub.versionEvent = {
      type: 'NO_NEW_VERSION_DETECTED',
    } as VersionEvent;
    const notificationServiceStub = TestBed.inject(AgariNotificationServiceStub);

    TestBed.inject(InstallerService);

    expect(notificationServiceStub.addNotification).not.toHaveBeenCalled();
  });

  it('should display notification if version is detected', () => {
    const swUpdateStub = TestBed.inject(SwUpdateStub);
    swUpdateStub.versionEvent = {
      type: 'VERSION_DETECTED',
    } as VersionEvent;
    const notificationServiceStub = TestBed.inject(AgariNotificationServiceStub);

    TestBed.inject(InstallerService);

    expect(notificationServiceStub.addNotification).toHaveBeenCalledWith('New update available. Installing...');
  });

  it('should display notification if version installation has failed', () => {
    const swUpdateStub = TestBed.inject(SwUpdateStub);
    swUpdateStub.versionEvent = {
      type: 'VERSION_INSTALLATION_FAILED',
    } as VersionEvent;
    const notificationServiceStub = TestBed.inject(AgariNotificationServiceStub);

    TestBed.inject(InstallerService);

    expect(notificationServiceStub.addNotification).toHaveBeenCalledTimes(1);

    const call = notificationServiceStub.addNotification.mock.calls[0];
    expect(call[0]).toBe('Update failed.');
    expect(call[1]?.time).toBe(15000);
    expect(call[1]?.action?.label).toBe('Try again');
  });

  it('should recheck for updates if version installation has failed and user performs action', () => {
    const swUpdateStub = TestBed.inject(SwUpdateStub);
    swUpdateStub.versionEvent = {
      type: 'VERSION_INSTALLATION_FAILED',
    } as VersionEvent;
    const notificationServiceStub = TestBed.inject(AgariNotificationServiceStub);

    TestBed.inject(InstallerService);

    const call = notificationServiceStub.addNotification.mock.calls[0];
    const onClose = call[1]?.action?.onClose;
    onClose?.();

    expect(swUpdateStub.checkForUpdate).toHaveBeenCalled();
  });

  it('should display notification if version installation has succeeded', () => {
    const swUpdateStub = TestBed.inject(SwUpdateStub);
    swUpdateStub.versionEvent = {
      type: 'VERSION_READY',
      latestVersion: {
        appData: {
          version: '1.0.0',
        },
      },
    } as VersionEvent;
    const notificationServiceStub = TestBed.inject(AgariNotificationServiceStub);

    TestBed.inject(InstallerService);

    expect(notificationServiceStub.addNotification).toHaveBeenCalledTimes(1);

    const call = notificationServiceStub.addNotification.mock.calls[0];
    expect(call[0]).toBe('Update to 1.0.0 installed. Reload the application to apply the update.');
    expect(call[1]?.time).toBe(15000);
    expect(call[1]?.action?.label).toBe('Reload now');
  });
});

@Injectable()
class SwUpdateStub {
  readonly versionUpdates = new Observable<VersionEvent>((subscriber) => {
    if (this.versionEvent != null) {
      subscriber.next(this.versionEvent);
      subscriber.complete();
    }

    return subscriber;
  });

  readonly checkForUpdate: jest.Mock<Promise<boolean>, []> = jest.fn();

  versionEvent?: VersionEvent;
}

@Injectable()
class AgariNotificationServiceStub {
  readonly addNotification: jest.Mock<void, [string, AgariNotificationDismissOptions | undefined]> = jest.fn();
}
