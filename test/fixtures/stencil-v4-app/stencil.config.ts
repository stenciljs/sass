import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'stencilv4app',
  plugins: [sass()],
  outputTargets: [{ type: 'www', serviceWorker: null }],
};
