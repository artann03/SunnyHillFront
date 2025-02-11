import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

console.log('[Main] Starting application bootstrap');

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('[Main] Application bootstrapped successfully');
  })
  .catch((err) => {
    console.error('[Main] Bootstrap error:', err);
  });
