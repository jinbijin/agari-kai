import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AgariNotificationService } from './notification.service';
import { AgariNotificationDismissAction } from './notification.types';

const DEFAULT_NOTIFICATION_TIMEOUT = 5000;
const TEST_MESSAGE = 'Test';
const TEST_MESSAGE_QUEUED = 'Queued';
const TEST_ACTION_LABEL = 'Action';

describe('AgariNotificationService', () => {
  it('should create', () => {
    const service = createService();

    expect(service).toBeDefined();
  });

  describe('collapsed', () => {
    it('should start empty', () => {
      const service = createService();

      expect(service.notifications()).toEqual([]);
    });

    it('should not be expanded', () => {
      const service = createService();

      expect(service.expanded()).toEqual(false);
    });

    it('should add default notification', () => {
      const service = createService();

      service.addNotification(TEST_MESSAGE);

      expect(service.notifications()).toEqual([
        { id: 1, message: TEST_MESSAGE, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);
    });

    it('should automatically dismiss default notification', fakeAsync(() => {
      const service = createService();

      service.addNotification(TEST_MESSAGE);

      tick(DEFAULT_NOTIFICATION_TIMEOUT);

      expect(service.notifications()).toEqual([]);
    }));

    it('should add notification with custom timer', () => {
      const service = createService();
      const time = 1000;

      service.addNotification(TEST_MESSAGE, { time });

      expect(service.notifications()).toEqual([{ id: 1, message: TEST_MESSAGE, triggers: { time } }]);
    });

    it('should automatically dismiss notification with custom timer', fakeAsync(() => {
      const service = createService();
      const time = 1000;

      service.addNotification(TEST_MESSAGE, { time });

      tick(time);

      expect(service.notifications()).toEqual([]);
    }));

    it('should add notification with action', () => {
      const service = createService();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification('Test', { action });

      expect(service.notifications()).toEqual([{ id: 1, message: TEST_MESSAGE, triggers: { action } }]);
    });

    it('should not automatically dismiss notification with action', fakeAsync(() => {
      const service = createService();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification(TEST_MESSAGE, { action });

      flush();

      expect(service.notifications()).toEqual([{ id: 1, message: TEST_MESSAGE, triggers: { action } }]);
    }));

    it('should dismiss notification with action', () => {
      const service = createService();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification(TEST_MESSAGE, { action });
      service.dismissCurrentNotification();

      expect(service.notifications()).toEqual([]);
    });

    it('should call onClose with action on manual dismiss', () => {
      const service = createService();
      const onClose = jest.fn();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL, onClose };

      service.addNotification(TEST_MESSAGE, { action });
      service.dismissCurrentNotification();

      expect(onClose).toHaveBeenCalled();
    });

    it('should add notification with action and timer', () => {
      const service = createService();
      const time = 1000;
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification(TEST_MESSAGE, { time, action });

      expect(service.notifications()).toEqual([{ id: 1, message: TEST_MESSAGE, triggers: { time, action } }]);
    });

    it('should automatically dismiss notification with action and timer', fakeAsync(() => {
      const service = createService();
      const time = 1000;
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification(TEST_MESSAGE, { time, action });

      tick(time);

      expect(service.notifications()).toEqual([]);
    }));

    it('should dismiss notification with action and timer', () => {
      const service = createService();
      const time = 1000;
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification(TEST_MESSAGE, { time, action });
      service.dismissCurrentNotification();

      expect(service.notifications()).toEqual([]);
    });

    it('should not call onClose with action and timer on automatic dismiss', fakeAsync(() => {
      const service = createService();
      const onClose = jest.fn();
      const time = 1000;
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL, onClose };

      service.addNotification(TEST_MESSAGE, { time, action });

      tick(time);

      expect(onClose).not.toHaveBeenCalled();
    }));

    it('should call onClose with action and timer on manual dismiss', () => {
      const service = createService();
      const onClose = jest.fn();
      const time = 1000;
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL, onClose };

      service.addNotification(TEST_MESSAGE, { time, action });
      service.dismissCurrentNotification();

      expect(onClose).toHaveBeenCalled();
    });

    it('should queue multiple notifications', () => {
      const service = createService();

      service.addNotification(TEST_MESSAGE);
      service.addNotification(TEST_MESSAGE_QUEUED);

      expect(service.notifications()).toEqual([
        { id: 1, message: TEST_MESSAGE, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);
    });

    it('should empty queue in order', fakeAsync(() => {
      const service = createService();

      service.addNotification(TEST_MESSAGE);
      service.addNotification(TEST_MESSAGE_QUEUED);

      tick(DEFAULT_NOTIFICATION_TIMEOUT);

      expect(service.notifications()).toEqual([
        { id: 2, message: TEST_MESSAGE_QUEUED, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);

      tick(DEFAULT_NOTIFICATION_TIMEOUT);

      expect(service.notifications()).toEqual([]);
    }));
  });

  describe('expand', () => {
    it('should display all queued and automatically dismissed notifications', fakeAsync(() => {
      const service = createService();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification(TEST_MESSAGE);
      service.addNotification(TEST_MESSAGE_QUEUED);
      service.addNotification('Dismissed', { action });
      service.addNotification('Current', { action });
      service.addNotification('In queue 1', { action });
      service.addNotification('In queue 2', { action });

      tick(DEFAULT_NOTIFICATION_TIMEOUT);
      tick(DEFAULT_NOTIFICATION_TIMEOUT);
      service.dismissCurrentNotification();

      service.openNotificationCenter();

      expect(service.notifications()).toEqual([
        { id: 6, message: 'In queue 2', triggers: { action } },
        { id: 5, message: 'In queue 1', triggers: { action } },
        { id: 4, message: 'Current', triggers: { action } },
        { id: 2, message: TEST_MESSAGE_QUEUED, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
        { id: 1, message: TEST_MESSAGE, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);
    }));

    it('should stop automatic dismissals', fakeAsync(() => {
      const service = createService();

      service.addNotification(TEST_MESSAGE);

      service.openNotificationCenter();

      flush();

      expect(service.notifications()).toEqual([
        { id: 1, message: TEST_MESSAGE, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);
    }));
  });

  describe('expanded', () => {
    it('should be expanded', () => {
      const service = createService();

      service.openNotificationCenter();

      expect(service.expanded()).toEqual(true);
    });

    it('should dismiss latest notification', () => {
      const service = createService();

      service.openNotificationCenter();
      service.addNotification(TEST_MESSAGE);
      service.addNotification(TEST_MESSAGE_QUEUED);

      service.dismissNotification(0, false);

      expect(service.notifications()).toEqual([
        { id: 1, message: TEST_MESSAGE, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);
    });

    it('should dismiss earliest notification', () => {
      const service = createService();

      service.openNotificationCenter();
      service.addNotification(TEST_MESSAGE);
      service.addNotification(TEST_MESSAGE_QUEUED);

      service.dismissNotification(1, false);

      expect(service.notifications()).toEqual([
        { id: 2, message: TEST_MESSAGE_QUEUED, triggers: { time: DEFAULT_NOTIFICATION_TIMEOUT } },
      ]);
    });

    it('should call canClose if handled', () => {
      const service = createService();
      const onClose = jest.fn();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL, onClose };

      service.openNotificationCenter();
      service.addNotification(TEST_MESSAGE, { action });

      service.dismissNotification(0);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not call canClose if ignored', () => {
      const service = createService();
      const onClose = jest.fn();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL, onClose };

      service.openNotificationCenter();
      service.addNotification(TEST_MESSAGE, { action });

      service.dismissNotification(0, false);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('collapse', () => {
    it('should not keep queued notifications on collapse', () => {
      const service = createService();
      const action: AgariNotificationDismissAction = { label: TEST_ACTION_LABEL };

      service.addNotification('Current', { action });
      service.addNotification('In queue 1', { action });
      service.addNotification('In queue 2', { action });

      service.openNotificationCenter();

      service.closeNotificationCenter();

      expect(service.notifications()).toEqual([]);
    });
  });
});

function createService(): AgariNotificationService {
  return TestBed.inject(AgariNotificationService);
}
