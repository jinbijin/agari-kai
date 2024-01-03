import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgariHeaderComponent } from './header.component';
import { Component, DebugElement, HostListener, Injectable } from '@angular/core';
import { AgariNotificationService } from '../notification/notification.service';
import { By } from '@angular/platform-browser';

describe('AgariHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [AgariHeaderComponent],
      providers: [
        AgariNotificationServiceStub,
        { provide: AgariNotificationService, useExisting: AgariNotificationServiceStub },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestComponent);
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should open notification center', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const notificationCenterButton = notificationCenterButtonElement(fixture);
    notificationCenterButton.nativeElement.click();
    fixture.detectChanges();

    const service = TestBed.inject(AgariNotificationServiceStub);
    expect(service.openNotificationCenter).toHaveBeenCalled();
    expect(fixture.componentInstance.onClick).not.toHaveBeenCalled();
  });
});

function notificationCenterButtonElement(fixture: ComponentFixture<TestComponent>): DebugElement {
  return fixture.debugElement.query(By.css('[data-test-id="open-notification-center"]'));
}

@Component({
  template: '<header agariHeader></header>',
})
class TestComponent {
  @HostListener('click') onClick = jest.fn<void, []>();
}

@Injectable()
class AgariNotificationServiceStub {
  openNotificationCenter = jest.fn<void, []>();
}
