import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'mfe-explore',
  exposes: {
    './Routes':
      'packages/mfe-explore/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
