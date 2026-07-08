import type { StencilWizardPlugin, WizardContext } from '@stencil/cli';

/**
 * Stencil CLI wizard plugin for `@stencil/sass`.
 *
 * Contributes:
 * - `init` - adds the `sass()` plugin (and its import) to `stencil.config.ts`.
 * - `generate` - offers `.scss` / `.sass` as stylesheet options in `stencil generate`.
 */
export const wizard: StencilWizardPlugin = {
  generate: {
    styleExtensions: ['scss', 'sass'],
  },

  init: {
    id: '@stencil/sass',
    displayName: 'Sass',
    description: 'Sass/SCSS styles',

    async run({ prompts, openStencilConfig }: WizardContext): Promise<void> {
      const { intro, outro, log } = prompts;

      intro('Sass - Sass/SCSS styles for Stencil');

      const editor = await openStencilConfig();

      const hasImport = editor.hasImport('@stencil/sass');
      const hasPlugin = editor.pluginsContains('sass(');

      if (hasImport && hasPlugin) {
        log.info('sass() is already configured in stencil.config.ts');
        outro('Nothing to do');
        return;
      }

      editor.addImport('@stencil/sass', ['sass']);
      if (!hasPlugin) {
        editor.addPlugin('sass()');
      }
      await editor.save();

      outro('Sass configured - use .scss / .sass styleUrls in your components');
    },
  },
};
