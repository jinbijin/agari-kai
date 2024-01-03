import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component, Injectable } from '@angular/core';
import { InstallerService } from './core/installer/installer.service';
import { NotificationCenterComponent } from './core/notification/notification-center.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: InstallerService, useClass: InstallerServiceStub }],
    });

    TestBed.overrideComponent(AppComponent, {
      remove: { imports: [NotificationCenterComponent] },
      add: { imports: [NotificationCenterStubComponent] },
    });

    await TestBed.compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render under construction marker', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-test-id="v0-marker"]')?.textContent).toContain(
      'This app is under construction...',
    );
  });

  it('should contain the notification center', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const notificationCenter = fixture.debugElement.query(By.directive(NotificationCenterStubComponent));
    expect(notificationCenter).toBeDefined();
  });
});

@Injectable()
class InstallerServiceStub {}

@Component({
  selector: 'agari-notification-center',
  template: '',
  standalone: true,
})
class NotificationCenterStubComponent {}
