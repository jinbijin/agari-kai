import { AppComponent } from './app/app.component';
import { provideServiceWorker } from '@angular/service-worker';
import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER, isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => document.fonts.ready,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
