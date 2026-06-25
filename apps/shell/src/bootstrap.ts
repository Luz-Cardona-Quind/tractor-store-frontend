import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function enableMocking(): Promise<void> {
  if (typeof window === 'undefined') return;
  const { worker } = await import('./mocks');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() =>
  bootstrapApplication(App, appConfig).catch((err) => console.error(err)),
);
