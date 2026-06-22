import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'mfe-explore',
  exposes: {
    './Routes':
      'packages/mfe-explore/src/app/remote-entry/entry.routes.ts',
    './Header':
      'packages/mfe-explore/src/app/components/header/header.component.ts',
    './Footer':
      'packages/mfe-explore/src/app/components/footer/footer.component.ts',
  },
};

export default config;
