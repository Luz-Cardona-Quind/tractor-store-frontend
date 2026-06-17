import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'mfe-checkout',
  exposes: {
    './Routes':
      'packages/mfe-checkout/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
