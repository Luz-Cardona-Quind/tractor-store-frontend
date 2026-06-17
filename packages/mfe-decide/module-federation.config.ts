import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'mfe-decide',
  exposes: {
    './Routes':
      'packages/mfe-decide/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
