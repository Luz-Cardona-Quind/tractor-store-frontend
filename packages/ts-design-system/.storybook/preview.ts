import { provideZonelessChangeDetection } from '@angular/core';
import { applicationConfig, Preview } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideZonelessChangeDetection()],
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
