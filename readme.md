# @stencil/sass

This package is used to easily precompile Sass files within Stencil components. Internally this plugin uses a pure JavaScript implementation of [Sass](https://www.npmjs.com/package/sass). Please see the
[Behavioral Differences from Ruby Sass](https://www.npmjs.com/package/sass#behavioral-differences-from-ruby-sass) doc if issues have surfaced since upgrading from previous versions which used used the `node-sass` implementation.

First, npm install within the project:

```
npm install @stencil/sass --save-dev
```

Next, within the project's stencil config, import the plugin and add it to the config's `plugins` property:

#### stencil.config.ts

```ts
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  plugins: [
    sass({
      // Optional config options
    }),
  ],
};
```

During development, this plugin will kick-in for `.scss` or `.sass` style urls, and precompile them to CSS.

## Options

Sass options can be passed to the plugin within the stencil config, which are used directly by `sass`. Please reference [sass documentation](https://www.npmjs.com/package/sass) for all available options. Note that this plugin automatically adds the component's directory to the `includePaths` array.

### Inject Globals Sass Paths

The `injectGlobalPaths` config is an array of paths that automatically get added as `@use` with a wildcard (to avoid namespacing) declarations to all components. This can be useful to inject Sass variables, mixins and functions to override defaults of external collections. For example, apps can override default Sass variables of [Ionic components](https://www.npmjs.com/package/@ionic/core). Relative paths within `injectGlobalPaths` should be relative to the stencil config file.

```js
exports.config = {
  plugins: [
    sass({
      injectGlobalPaths: ['src/globals/variables.scss', 'src/globals/mixins.scss'],
    }),
  ],
};
```

Note that each of these files are always added to each component, so in most cases they shouldn't contain CSS because it'll get duplicated in each component. Instead, `injectGlobalPaths` should only be used for Sass variables, mixins and functions, but does not contain any CSS.

### Warning Controls

To control and suppress different types of Sass warnings you can use the following options:

- `quietDeps`: Silences warnings from dependencies (files loaded through `loadPaths` or `importers`)
- `silenceDeprecations`: Silences specific deprecation warnings by their identifiers (e.g., 'import' for @import rule warnings)

```js
exports.config = {
  plugins: [
    sass({
      // Silence all dependency warnings
      quietDeps: true,
      // Silence specific deprecation warnings
      silenceDeprecations: ['import'],
    }),
  ],
};
```

## Related

- [sass](https://www.npmjs.com/package/sass)
- [Stencil](https://stenciljs.com/)
- [Ionic Discord](https://chat.stenciljs.com/)
- [Ionic Components](https://www.npmjs.com/package/@ionic/core)
- [Ionicons](http://ionicons.com/)

## Contributing

Please see our [Contributor Code of Conduct](https://github.com/stenciljs/.github/blob/main/CODE_OF_CONDUCT.md) for information on our rules of conduct.
