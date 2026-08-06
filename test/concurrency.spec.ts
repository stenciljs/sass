import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { LegacyException, LegacyResult, render } from 'sass-embedded';

import { sass } from '../dist/index.js';
import type { PluginCtx } from '../dist/declarations';

const renderState = vi.hoisted(() => ({
  active: 0,
  failNext: false,
  peak: 0,
}));

vi.mock('sass-embedded', async (importOriginal) => {
  const original = await importOriginal<typeof import('sass-embedded')>();

  return {
    ...original,
    render: vi.fn((_options, callback: Parameters<typeof render>[1]) => {
      renderState.active += 1;
      renderState.peak = Math.max(renderState.peak, renderState.active);

      setTimeout(() => {
        renderState.active -= 1;

        if (renderState.failNext) {
          renderState.failNext = false;
          callback(
            Object.assign(new Error('Sass compilation failed'), {
              formatted: 'Error: Sass compilation failed',
              status: 1,
              file: 'stdin',
              line: 1,
              column: 1,
            }) satisfies LegacyException,
          );
          return;
        }

        callback(undefined, {
          css: Buffer.from('.fixture { color: red; }'),
          stats: {
            entry: 'data',
            start: 0,
            end: 1,
            duration: 1,
            includedFiles: [],
          },
        } satisfies LegacyResult);
      }, 10);
    }),
  };
});

describe('render concurrency', () => {
  let context: PluginCtx;

  const transformAll = (count: number) => {
    const plugin = sass();

    return Promise.all(
      Array.from({ length: count }, (_, index) =>
        plugin.transform('.fixture { color: red; }', `/Users/my/app/src/fixture-${index}.scss`, context),
      ),
    );
  };

  beforeEach(() => {
    renderState.active = 0;
    renderState.failNext = false;
    renderState.peak = 0;
    context = {
      config: {
        rootDir: '/Users/my/app/',
        srcDir: '/Users/my/app/src/',
        maxConcurrentWorkers: 2,
      },
      cache: null as any,
      sys: {
        normalizePath: vi.fn((path: string) => path),
      } as any,
      fs: {
        readFileSync: vi.fn(() => '.fixture { color: red; }'),
        writeFile: vi.fn(() => Promise.resolve()),
      } as any,
      diagnostics: [],
    };
  });

  it("limits concurrent Sass renders to Stencil's worker count", async () => {
    const results = await transformAll(6);

    expect(results).toHaveLength(6);
    expect(renderState.peak).toBe(2);
  });

  it('continues rendering when Stencil workers are disabled', async () => {
    context.config.maxConcurrentWorkers = 0;
    const results = await transformAll(3);

    expect(results).toHaveLength(3);
    expect(renderState.peak).toBe(1);
  });

  it('continues queued renders after a Sass error', async () => {
    context.config.maxConcurrentWorkers = 1;
    renderState.failNext = true;
    const results = await transformAll(3);

    expect(results).toHaveLength(3);
    expect(context.diagnostics).toHaveLength(1);
    expect(renderState.peak).toBe(1);
  });
});
