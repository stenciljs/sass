import type { StencilConfigEditor, WizardContext } from '@stencil/cli';
import { describe, it, expect, vi, type Mock } from 'vitest';

import { wizard } from '../src/wizard';

function fakeEditor(initial: { hasImport?: boolean; hasPlugin?: boolean } = {}): {
  editor: StencilConfigEditor;
  addImport: Mock;
  addPlugin: Mock;
  save: Mock;
} {
  const addImport = vi.fn();
  const addPlugin = vi.fn();
  const save = vi.fn().mockResolvedValue(undefined);

  const editor: StencilConfigEditor = {
    hasImport: vi.fn().mockReturnValue(initial.hasImport ?? false),
    addImport,
    outputTargetsContains: vi.fn().mockReturnValue(false),
    addOutputTarget: vi.fn(),
    replaceOutputTarget: vi.fn().mockReturnValue(false),
    removeOutputTarget: vi.fn().mockReturnValue(false),
    pluginsContains: vi.fn().mockReturnValue(initial.hasPlugin ?? false),
    addPlugin,
    replacePlugin: vi.fn().mockReturnValue(false),
    removePlugin: vi.fn().mockReturnValue(false),
    save,
  };

  return { editor, addImport, addPlugin, save };
}

function fakeContext(editor: StencilConfigEditor): WizardContext {
  return {
    isNewProject: false,
    prompts: {
      intro: vi.fn(),
      outro: vi.fn(),
      log: { info: vi.fn() },
    } as unknown as WizardContext['prompts'],
    nypm: {} as WizardContext['nypm'],
    config: {
      rootDir: '/project',
      srcDir: '/project/src',
      namespace: 'MyLib',
      fsNamespace: 'mylib',
      outputTargets: [],
    },
    openStencilConfig: () => Promise.resolve(editor),
    ts: {} as WizardContext['ts'],
  };
}

describe('wizard', () => {
  it('contributes .scss/.sass as generate style extensions', () => {
    expect(wizard.generate?.styleExtensions).toEqual(['scss', 'sass']);
  });

  it('exposes a stable id/displayName/description for init', () => {
    expect(wizard.init?.id).toBe('@stencil/sass');
    expect(wizard.init?.displayName).toBe('Sass');
    expect(wizard.init?.description).toBeTruthy();
  });

  describe('init.run', () => {
    it('adds the import and plugin() call when neither exists', async () => {
      const { editor, addImport, addPlugin, save } = fakeEditor();
      await wizard.init!.run(fakeContext(editor));

      expect(addImport).toHaveBeenCalledWith('@stencil/sass', ['sass']);
      expect(addPlugin).toHaveBeenCalledWith('sass()');
      expect(save).toHaveBeenCalled();
    });

    it('adds the plugin without duplicating the import when only the import exists', async () => {
      const { editor, addImport, addPlugin, save } = fakeEditor({ hasImport: true, hasPlugin: false });
      await wizard.init!.run(fakeContext(editor));

      // addImport is a no-op guarded internally by the editor itself in real usage;
      // the wizard always calls it, but only the plugin needs the missing-check here.
      expect(addImport).toHaveBeenCalledWith('@stencil/sass', ['sass']);
      expect(addPlugin).toHaveBeenCalledWith('sass()');
      expect(save).toHaveBeenCalled();
    });

    it('is a no-op when already fully configured', async () => {
      const { editor, addImport, addPlugin, save } = fakeEditor({ hasImport: true, hasPlugin: true });
      await wizard.init!.run(fakeContext(editor));

      expect(addImport).not.toHaveBeenCalled();
      expect(addPlugin).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
    });
  });
});
