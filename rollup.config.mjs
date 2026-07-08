import fs from 'node:fs/promises'
import typescript from '@rollup/plugin-typescript';
import rollupResolve from '@rollup/plugin-node-resolve';

const pkg = JSON.parse((await fs.readFile('./package.json')));

const external = [
  "sass-embedded",
  'node:path'
];

/**
 * Generate a single ESM output bundle
 */
const mainBundle = {
  // the input is expected to exist at this location as a result of running the typescript compiler
  input: 'src/index.ts',

  plugins: [
    typescript(),
    rollupResolve({
      preferBuiltins: true
    }),
  ],

  external,

  output: {
    format: 'esm',
    file: pkg.main
  }
};

/**
 * The `stencil.wizard` entry point, loaded by `@stencil/cli` to participate
 * in `stencil init` / `stencil generate`. Bundled separately since it's only
 * ever loaded via dynamic `import()` by the CLI, never by consumers directly.
 */
const wizardBundle = {
  input: 'src/wizard.ts',

  plugins: [
    typescript(),
    rollupResolve({
      preferBuiltins: true
    }),
  ],

  external: [
    ...external,
    '@stencil/cli'
  ],

  output: {
    format: 'esm',
    file: 'dist/wizard.js'
  }
};

export default [mainBundle, wizardBundle];
