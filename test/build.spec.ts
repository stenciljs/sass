import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { sass } from '../dist/index.js';
import type { PluginCtx } from '../dist/declarations';

describe('test build', () => {
  let context: PluginCtx;

  beforeEach(() => {
    context = {
      config: {
        rootDir: '/Users/my/app/',
        srcDir: '/Users/my/app/src/',
      },
      cache: null as any,
      sys: {
        normalizePath: vi.fn((p: string) => p),
      } as any,
      fs: {
        readFileSync(filePath: string) {
          return fs.readFileSync(filePath, 'utf8');
        },
        writeFile() {
          return Promise.resolve();
        }
      } as any,
      diagnostics: []
    };
  })

  it('transform scss', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'scss', 'test-a.scss');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    const results = await s.transform(sourceText, filePath, context) as any;
    expect(results.code).toContain('color: red');
    expect(results.dependencies).toEqual([]);
    expect(results.diagnostics).toEqual(undefined);
  });

  it('transform, import scss', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'scss', 'test-b.scss');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    const results = await s.transform(sourceText, filePath, context) as any;
    expect(results.code).toContain('color: red');
    expect(results.dependencies).toEqual([
      path.join(__dirname, 'fixtures', 'scss', 'variables.scss')
    ]);
    expect(results.diagnostics).toEqual(undefined);
    expect(context.sys.normalizePath).toHaveBeenCalledTimes(1)
  });

  it('transform, error scss', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'scss', 'test-c.scss');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    await s.transform(sourceText, filePath, context);
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0].level).toEqual('error');
    expect(context.diagnostics[0].language).toEqual('scss');
    expect(context.diagnostics[0].lineNumber).toEqual(2);
    expect(context.diagnostics[0].columnNumber).toEqual(23);
    expect(context.diagnostics[0].lines.length).toEqual(3);

    expect(context.diagnostics[0].lines[0].lineIndex).toEqual(0);
    expect(context.diagnostics[0].lines[0].lineNumber).toEqual(1);
    expect(context.diagnostics[0].lines[0].errorCharStart).toEqual(-1);
    expect(context.diagnostics[0].lines[0].errorLength).toEqual(-1);
    expect(context.diagnostics[0].lines[0].text).toEqual('body{color:blue}');

    expect(context.diagnostics[0].lines[1].lineIndex).toEqual(1);
    expect(context.diagnostics[0].lines[1].lineNumber).toEqual(2);
    expect(context.diagnostics[0].lines[1].errorCharStart).toEqual(22);
    expect(context.diagnostics[0].lines[1].errorLength).toEqual(1);
    expect(context.diagnostics[0].lines[1].text).toEqual('   hello i am an error!');

    expect(context.diagnostics[0].lines[2].lineIndex).toEqual(2);
    expect(context.diagnostics[0].lines[2].lineNumber).toEqual(3);
    expect(context.diagnostics[0].lines[2].errorCharStart).toEqual(-1);
    expect(context.diagnostics[0].lines[2].errorLength).toEqual(-1);
    expect(context.diagnostics[0].lines[2].text).toEqual('  div{color:green}');
  });

  it('transform sass', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'sass', 'test-a.sass');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    const results = await s.transform(sourceText, filePath, context) as any;
    expect(results.code).toContain('color: red');
    expect(results.dependencies).toEqual([]);
    expect(results.diagnostics).toEqual(undefined);
  });

  it('transform, import sass', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'sass', 'test-b.sass');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    const results = await s.transform(sourceText, filePath, context) as any;
    expect(results.code).toContain('color: red');
    expect(results.dependencies).toEqual([
      path.join(__dirname, 'fixtures', 'sass', 'variables.sass')
    ]);
    expect(results.diagnostics).toEqual(undefined);
  });

  it('transform, error sass', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'sass', 'test-c.sass');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    await s.transform(sourceText, filePath, context);
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0].level).toEqual('error');
    expect(context.diagnostics[0].language).toEqual('sass');
    expect(context.diagnostics[0].lineNumber).toEqual(3);
    expect(context.diagnostics[0].columnNumber).toEqual(20);
    expect(context.diagnostics[0].lines.length).toEqual(3);

    expect(context.diagnostics[0].lines[0].lineIndex).toEqual(1);
    expect(context.diagnostics[0].lines[0].lineNumber).toEqual(2);
    expect(context.diagnostics[0].lines[0].errorCharStart).toEqual(-1);
    expect(context.diagnostics[0].lines[0].errorLength).toEqual(-1);
    expect(context.diagnostics[0].lines[0].text).toEqual('  color: blue');

    expect(context.diagnostics[0].lines[1].lineIndex).toEqual(2);
    expect(context.diagnostics[0].lines[1].lineNumber).toEqual(3);
    expect(context.diagnostics[0].lines[1].errorCharStart).toEqual(19);
    expect(context.diagnostics[0].lines[1].errorLength).toEqual(1);
    expect(context.diagnostics[0].lines[1].text).toEqual('hello i am an error!');

    expect(context.diagnostics[0].lines[2].lineIndex).toEqual(3);
    expect(context.diagnostics[0].lines[2].lineNumber).toEqual(4);
    expect(context.diagnostics[0].lines[2].errorCharStart).toEqual(-1);
    expect(context.diagnostics[0].lines[2].errorLength).toEqual(-1);
    expect(context.diagnostics[0].lines[2].text).toEqual('div');
  });

  describe('paths containing a space', () => {
    const fixtureDir = path.join(__dirname, 'fixtures', 'with space');

    beforeEach(() => {
      // providing resolveModuleId makes the plugin install its own importer, as Stencil does
      context.config.rootDir = fixtureDir;
      context.sys.resolveModuleId = vi.fn(() => Promise.resolve({}));
    });

    it('transform, use a relative path containing a space', async () => {
      const filePath = path.join(fixtureDir, 'test-a.scss');
      const sourceText = fs.readFileSync(filePath, 'utf8');
      const s = sass();

      const results = await s.transform(sourceText, filePath, context) as any;
      expect(context.diagnostics).toEqual([]);
      expect(results.code).toContain('color: red');
    });

    it('transform, injectGlobalPaths under a directory containing a space', async () => {
      const filePath = path.join(fixtureDir, 'test-b.scss');
      const sourceText = fs.readFileSync(filePath, 'utf8');
      const s = sass({ injectGlobalPaths: ['globals.scss'] });

      const results = await s.transform(sourceText, filePath, context) as any;
      expect(context.diagnostics).toEqual([]);
      expect(results.code).toContain('color: red');
    });
  });

  it('name', async () => {
    const s = sass();
    expect(s.name).toBe('sass');
  });

});
