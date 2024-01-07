import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER, isDevMode } from '@angular/core';
import { APP_ROUTES } from './app/app.routes';
import { provideValidationMessages } from './app/validation/validation-message-collection.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideRouter(APP_ROUTES),
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => document.fonts.ready,
      multi: true,
    },
    provideValidationMessages({ key: 'required', message: () => 'This field is required.' }),
  ],
}).catch((err) => console.error(err));
