import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  remotes: ['mfe-explore', 'mfe-decide', 'mfe-checkout'],
};

export default config;
