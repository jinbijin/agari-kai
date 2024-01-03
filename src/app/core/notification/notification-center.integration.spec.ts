import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationCenterComponent } from './notification-center.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AgariNotificationService } from './notification.service';
import { NotificationComponent } from './notification.component';

describe('NotificationCenter', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NotificationCenterComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);
    expect(fixture.componentInstance).toBeDefined();
  });

  describe('collapsed', () => {
    it('should display notification', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification');
      fixture.detectChanges();

      const notification = notificationElement(fixture, 0);
      expect(notification).toBeDefined();
    });

    it('should display correct notification message', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification');
      fixture.detectChanges();

      const notificationText = notificationTextElement(fixture, 0);
      expect(notificationText.nativeElement.textContent).toBe('Test notification');
    });

    it('should not display notification action if none is specified', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification');
      fixture.detectChanges();

      const notificationButton = notificationActionButtonElement(fixture, 0);

      expect(notificationButton).toBe(null);
    });

    it('should display notification action if specified', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification', { action: { label: 'Do!' } });
      fixture.detectChanges();

      const notificationButton = notificationActionButtonElement(fixture, 0);
      expect(notificationButton.nativeElement.textContent).toBe('Do!');
    });

    it('should not display notification dismiss', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification', { action: { label: 'Do!' } });
      fixture.detectChanges();

      const notificationButton = notificationDismissButtonElement(fixture, 0);
      expect(notificationButton).toBe(null);
    });

    it('should be empty after action', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification', { action: { label: 'Do!' } });
      fixture.detectChanges();

      const notificationButton = notificationActionButtonElement(fixture, 0);
      notificationButton.nativeElement.click();
      fixture.detectChanges();

      const notifications = notificationElements(fixture);
      expect(notifications).toEqual([]);
    });
  });

  describe('expanded', () => {
    it('should have expanded class', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.openNotificationCenter();
      fixture.detectChanges();

      const notificationCenter = notificationCenterElement(fixture);
      expect(notificationCenter.nativeElement.className).toBe('expanded');
    });

    it('should display all notifications', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification');
      service.addNotification('Test notification 2');
      service.openNotificationCenter();
      fixture.detectChanges();

      const notifications = notificationElements(fixture);
      expect(notifications).toHaveLength(2);

      expect(notificationTextElement(fixture, 0).nativeElement.textContent).toBe('Test notification 2');
      expect(notificationTextElement(fixture, 1).nativeElement.textContent).toBe('Test notification');
    });

    it('should display dismiss', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification');
      service.openNotificationCenter();
      fixture.detectChanges();

      expect(notificationDismissButtonElement(fixture, 0).nativeElement.textContent).toBe('Dismiss');
    });

    it('should not display action if none is specified', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification');
      service.openNotificationCenter();
      fixture.detectChanges();

      expect(notificationActionButtonElement(fixture, 0)).toBe(null);
    });

    it('should display action if specified', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification', { action: { label: 'Do!' } });
      service.openNotificationCenter();
      fixture.detectChanges();

      expect(notificationActionButtonElement(fixture, 0).nativeElement.textContent).toBe('Do!');
    });

    it('should dismiss on action', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification', { action: { label: 'Do!' } });
      service.addNotification('Test notification 2');
      service.openNotificationCenter();
      fixture.detectChanges();

      const actionButton = notificationActionButtonElement(fixture, 1);
      actionButton.nativeElement.click();
      fixture.detectChanges();

      const notifications = notificationElements(fixture);
      expect(notifications).toHaveLength(1);

      const notification = notificationTextElement(fixture, 0);
      expect(notification.nativeElement.textContent).toBe('Test notification 2');
    });

    it('should dismiss on dismiss', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.addNotification('Test notification', { action: { label: 'Do!' } });
      service.addNotification('Test notification 2');
      service.openNotificationCenter();
      fixture.detectChanges();

      const dismissButton = notificationDismissButtonElement(fixture, 0);
      dismissButton.nativeElement.click();
      fixture.detectChanges();

      const notifications = notificationElements(fixture);
      expect(notifications).toHaveLength(1);

      const notification = notificationTextElement(fixture, 0);
      expect(notification.nativeElement.textContent).toBe('Test notification');
    });

    it('should collapse when clicked outside', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.openNotificationCenter();
      fixture.detectChanges();

      const outside = outsideButtonElement(fixture);
      outside.nativeElement.click();
      fixture.detectChanges();

      const notificationCenter = notificationCenterElement(fixture);
      expect(notificationCenter.nativeElement.className).toBeFalsy();
    });

    it('should not collapse when clicked inside', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const service = TestBed.inject(AgariNotificationService);
      service.openNotificationCenter();
      fixture.detectChanges();

      const notificationCenter = notificationCenterElement(fixture);
      notificationCenter.nativeElement.click();
      fixture.detectChanges();

      expect(notificationCenter.nativeElement.className).toBe('expanded');
    });
  });
});

function outsideButtonElement(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.css('#outside'));
}

function notificationCenterElement(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.directive(NotificationCenterComponent));
}

function notificationElements(fixture: ComponentFixture<TestComponent>): DebugElement[] {
  return fixture.debugElement.queryAll(By.directive(NotificationComponent));
}

function notificationElement(fixture: ComponentFixture<TestComponent>, index: number): DebugElement {
  return fixture.debugElement.queryAll(By.directive(NotificationComponent))[index];
}

function notificationTextElement(fixture: ComponentFixture<TestComponent>, index: number): DebugElement {
  const notification = notificationElement(fixture, index);
  return notification.query(By.css('p'));
}

function notificationActionButtonElement(fixture: ComponentFixture<TestComponent>, index: number): DebugElement {
  const notification = notificationElement(fixture, index);
  return notification.query(By.css('[data-test-id="notification-action"]'));
}

function notificationDismissButtonElement(fixture: ComponentFixture<TestComponent>, index: number): DebugElement {
  const notification = notificationElement(fixture, index);
  return notification.query(By.css('[data-test-id="notification-dismiss"]'));
}

@Component({
  template: '<button id="outside">Click me!</button><agari-notification-center popover="manual" />',
})
class TestComponent {}
