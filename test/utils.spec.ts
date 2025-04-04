import * as d from '../src/declarations';
import * as util from '../src/util';


describe('getRenderOptions', () => {

  const sourceText = 'body { color: blue; }';
  const fileName = '/some/path/file-name.scss';
  const context: d.PluginCtx = {
    config: {
      rootDir: '/Users/my/app/',
      srcDir: '/Users/my/app/src/',
    },
    fs: {} as any,
    diagnostics: []
  } as any;


  it('should remove "file" config', () => {
    const input: d.PluginOptions = {
      file: '/my/global/variables.scss'
    };
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.data).toBe(`body { color: blue; }`);
    expect(output.file).toBeUndefined();
  });

  it('should inject global sass array and not change input options or include globals in output opts', () => {
    const input: d.PluginOptions = {
      injectGlobalPaths: ['/my/global/variables.scss']
    };
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.data).toBe(`@use "/my/global/variables.scss" as *;body { color: blue; }`);
    // `injectGlobalPaths` in an input argument to the function, and does not exist on the return type (hence the type assertion)
    // we have this check to verify that we have not accidentally copied it to the generated configuration
    expect((output as any).injectGlobalPaths).toBeUndefined();
    expect(input.injectGlobalPaths).toHaveLength(1);
    expect(input.injectGlobalPaths[0]).toBe('/my/global/variables.scss');
  });

  it('should add dirname of filename to existing includePaths array and not change input options', () => {
    const input: d.PluginOptions = {
      includePaths: ['/some/other/include/path']
    };
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.includePaths).toHaveLength(2);
    expect(output.includePaths[0]).toBe('/some/other/include/path');
    expect(output.includePaths[1]).toBe('/some/path');
    expect(input.includePaths).toHaveLength(1);
    expect(input.includePaths[0]).toBe('/some/other/include/path');
  });

  it('should add dirname of filename to includePaths and not change input options', () => {
    const input: d.PluginOptions = {};
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.includePaths).toHaveLength(1);
    expect(output.includePaths[0]).toBe('/some/path');
    expect(input.includePaths).toBeUndefined();
  });

  it('should set data', () => {
    const input: d.PluginOptions = {};
    const output = util.getRenderOptions(input, sourceText, fileName, context);
    expect(output.data).toBe(sourceText);
  });

});


describe('usePlugin', () => {
  it.each(['.sass', '.scss', '.SASS', '.SCSS'])('returns true for a %s file', (extension) => {
    const fileName = `my-file${extension}`;
    expect(util.usePlugin(fileName)).toBe(true);
  });

  it.each(['.pcss', '.css', '.ts', '.tsx', '.js', '.jsx', '.mjs'])('returns false for a %s file', (extension) => {
    const fileName = `my-file${extension}`;
    expect(util.usePlugin(fileName)).toBe(false);
  });

  it.each([undefined, null])('returns false for non-string file (%s)', (fileName) => {
    // the intent of this test is to intentionally provide a non-string value, hence the assertion
    expect(util.usePlugin(fileName as unknown as string)).toBe(false);
  });
});

describe('createResultsId', () => {

  it('should change scss the extension to be css', () => {
    const input = '/my/path/my-file.scss';
    const output = util.createResultsId(input);
    expect(output).toBe('/my/path/my-file.css');
  });

  it('should change sass the extension to be css', () => {
    const input = '/my/path.DIR/my-file.whatever.SOME.dots.SASS';
    const output = util.createResultsId(input);
    expect(output).toBe('/my/path.DIR/my-file.whatever.SOME.dots.css');
  });

});

describe('getModuleId', () => {

  it('getModuleId non-scoped ~ package', () => {
    const m = util.getModuleId('~ionicons/dist/css/ionicons.css');
    expect(m.moduleId).toBe('ionicons');
    expect(m.filePath).toBe('dist/css/ionicons.css');
  });

  it('getModuleId non-scoped package', () => {
    const m = util.getModuleId('ionicons/dist/css/ionicons.css');
    expect(m.moduleId).toBe('ionicons');
    expect(m.filePath).toBe('dist/css/ionicons.css');
  });

  it('getModuleId non-scoped package, no path', () => {
    const m = util.getModuleId('ionicons');
    expect(m.moduleId).toBe('ionicons');
    expect(m.filePath).toBe('');
  });

  it('getModuleId scoped ~ package', () => {
    const m = util.getModuleId('~@ionic/core/dist/ionic/css/ionic.css');
    expect(m.moduleId).toBe('@ionic/core');
    expect(m.filePath).toBe('dist/ionic/css/ionic.css');
  });

  it('getModuleId scoped package', () => {
    const m = util.getModuleId('@ionic/core/dist/ionic/css/ionic.css');
    expect(m.moduleId).toBe('@ionic/core');
    expect(m.filePath).toBe('dist/ionic/css/ionic.css');
  });

  it('getModuleId scoped package, no path', () => {
    const m = util.getModuleId('@ionic/core');
    expect(m.moduleId).toBe('@ionic/core');
    expect(m.filePath).toBe('');
  });

});