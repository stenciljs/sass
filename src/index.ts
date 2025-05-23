import { type LegacyException, type LegacyResult, render } from 'sass-embedded';

import * as d from './declarations';
import { loadDiagnostic } from './diagnostics';
import { createResultsId, getRenderOptions, usePlugin } from './util';

/**
 * Helper type to note which plugin methods are defined for this plugin.
 */
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * The entrypoint of the Stencil Sass plugin
 *
 * This function creates & configures the plugin to be used by consuming Stencil projects
 *
 * For configuration details, please see the [GitHub README](https://github.com/stenciljs/sass).
 *
 * @param opts options to configure the plugin
 * @return the configured plugin
 */
export function sass(opts: d.PluginOptions = {}): WithRequired<d.Plugin, 'transform'> {
  return {
    name: 'sass',
    pluginType: 'css',
    /**
     * Performs the Sass file compilation
     * @param sourceText the contents of the Sass file to compile
     * @param fileName the name of the Sass file to compile
     * @param context a runtime context supplied by Stencil, providing access to the current configuration, an
     * in-memory FS, etc.
     * @returns the results of the Sass file compilation
     */
    transform(sourceText: string, fileName: string, context: d.PluginCtx): Promise<d.PluginTransformResults> {
      if (!usePlugin(fileName)) {
        return null;
      }
      if (typeof sourceText !== 'string') {
        return null;
      }
      const renderOpts = getRenderOptions(opts, sourceText, fileName, context);
      const results: d.PluginTransformResults = {
        id: createResultsId(fileName),
        dependencies: [],
      };

      if (sourceText.trim() === '') {
        results.code = '';
        return Promise.resolve(results);
      }

      return new Promise<d.PluginTransformResults>((resolve) => {
        try {
          // invoke sass' compiler at this point
          render(renderOpts, (err: LegacyException, sassResult: LegacyResult): void => {
            if (err) {
              loadDiagnostic(context, err, fileName);
              results.code = `/**  sass error${err && err.message ? ': ' + err.message : ''}  **/`;
              resolve(results);
            } else {
              results.dependencies = Array.from(sassResult.stats.includedFiles).map((dep) =>
                context.sys.normalizePath(dep),
              );
              results.code = sassResult.css.toString();

              // write this css content to memory only so it can be referenced
              // later by other plugins (autoprefixer)
              // but no need to actually write to disk
              context.fs.writeFile(results.id, results.code, { inMemoryOnly: true }).then(() => {
                resolve(results);
              });
            }
          });
        } catch (e) {
          // who knows, just good to play it safe here
          const diagnostic: d.Diagnostic = {
            level: 'error',
            type: 'css',
            language: 'scss',
            header: 'sass error',
            relFilePath: null,
            absFilePath: null,
            messageText: e,
            lines: [],
          };
          context.diagnostics.push(diagnostic);

          results.code = `/**  sass error${e && e.message ? ': ' + e.message : ''}  **/`;
          resolve(results);
        }
      });
    },
  };
}
