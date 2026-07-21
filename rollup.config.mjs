import fs from 'node:fs/promises'
import typescript from '@rollup/plugin-typescript';
import rollupResolve from '@rollup/plugin-node-resolve';

const pkg = JSON.parse((await fs.readFile('./package.json')));

const external = [
  "sass-embedded",
  'node:path'
];

/**
 * Generate ESM and CJS output bundles.
 *
 * Stencil v4's `stencil.config.ts` is loaded via CommonJS, so a `require`-able
 * build is still needed even though this repo otherwise targets ESM.
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

  output: [
    {
      format: 'esm',
      file: pkg.module
    },
    {
      format: 'cjs',
      file: pkg.main,
      exports: 'named'
    }
  ]
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
