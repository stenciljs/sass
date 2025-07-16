# Contributing to `@stencil/sass`

Thank you for your interest in contributing to the Stencil Sass Plugin! This guide will help you get started with the development process.

## Code of Conduct

Please read and follow our [Contributor Code of Conduct](https://github.com/stenciljs/.github/blob/main/CODE_OF_CONDUCT.md).

## Development Setup

### Prerequisites

- **Node.js**: Version 22.14.0 or higher (we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions)
- **npm**: Version 10.9.2 or higher
- **Git**: For version control

### Getting Started

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sass.git
   cd sass
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## Project Structure

```
sass/
├── src/                 # Source code
│   ├── index.ts        # Main plugin entry point
│   ├── declarations.ts # TypeScript type definitions
│   ├── util.ts         # Utility functions
│   └── diagnostics.ts  # Error handling and diagnostics
├── test/               # Test files
│   ├── build.spec.ts   # Build transformation tests
│   ├── utils.spec.ts   # Utility function tests
│   └── fixtures/       # Test fixture files (.scss/.sass)
├── dist/               # Built output (generated)
└── .github/            # GitHub workflows and templates
```

## Development Workflow

### Available Scripts

- `npm run build` - Build the plugin for distribution
- `npm run watch` - Build and watch for changes during development
- `npm test` - Run the test suite
- `npm run test.watch` - Run tests in watch mode
- `npm run prettier` - Format code with Prettier
- `npm run prettier.dry-run` - Check code formatting
- `npm run test.ci` - Run tests and formatting checks (used in CI)

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Write Code**
   - Follow existing code patterns and conventions
   - Add TypeScript types for new functionality
   - Include JSDoc comments for public APIs

3. **Add Tests**
   - Write unit tests for new functionality
   - Add integration tests if needed
   - Place test fixtures in `test/fixtures/` if testing file transformations
   - Ensure all tests pass: `npm test`

4. **Format Code**
   ```bash
   npm run prettier
   ```

5. **Build and Test**
   ```bash
   npm run build
   npm run test.ci
   ```

## Testing

### Test Structure

- **Unit Tests**: Located in `test/*.spec.ts`
- **Fixtures**: Sample `.scss` and `.sass` files in `test/fixtures/`
- **Test Framework**: Jest with custom TypeScript preprocessor

### Writing Tests

- Test files should end with `.spec.ts`
- Use descriptive test names that explain the expected behavior
- Include both positive and negative test cases
- Test error conditions and edge cases

### Example Test Pattern

```typescript
describe('your feature', () => {
  it('should handle valid input correctly', async () => {
    // Arrange
    const input = 'your test input';
    
    // Act
    const result = await yourFunction(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.code).toContain('expected output');
  });
});
```

## Code Style and Standards

### TypeScript Guidelines

- Use strict TypeScript settings (already configured)
- Provide explicit types for function parameters and return values
- Use interfaces for complex object types
- Avoid `any` types when possible

### Code Formatting

- We use Prettier with `@ionic/prettier-config`
- Run `npm run prettier` before committing
- The CI will fail if code is not properly formatted

### Naming Conventions

- Use `camelCase` for variables and functions
- Use `PascalCase` for types and interfaces
- Use `UPPER_SNAKE_CASE` for constants
- Use descriptive names that clearly indicate purpose

## Commit Guidelines

### Commit Message Format

Follow the conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(transform): add support for custom importers
fix(diagnostics): improve error message formatting
docs: update README with new configuration options
test: add tests for edge cases in util functions
```

## Pull Request Process

### Before Submitting

1. **Check Requirements**
   - [ ] Code builds successfully (`npm run build`)
   - [ ] All tests pass (`npm run test.ci`)
   - [ ] Code is formatted (`npm run prettier`)
   - [ ] Documentation updated if needed

2. **Test Against Multiple Stencil Versions**
   - The CI tests against Stencil v2, v3, v4, and the default version
   - Ensure your changes work with all supported versions

### Pull Request Checklist

When creating a PR, please:

- [ ] Use the provided PR template
- [ ] Include a clear description of changes
- [ ] Reference any related issues
- [ ] Add tests for new functionality
- [ ] Update documentation if needed
- [ ] Ensure CI passes

### Review Process

1. **Automated Checks**: CI must pass (build, tests, formatting)
2. **Code Review**: Maintainers will review your code
3. **Testing**: Changes are tested against multiple Stencil versions
4. **Merge**: Once approved, your PR will be merged

## Architecture Overview

### Plugin Structure

The Sass plugin implements the Stencil plugin interface:

- **Entry Point** (`src/index.ts`): Exports the main `sass()` function
- **Transform Function**: Handles `.scss` and `.sass` file compilation
- **Options Processing**: Normalizes and validates plugin options
- **Error Handling**: Provides detailed diagnostics for compilation errors

### Key Features

- **File Type Detection**: Automatically detects `.scss` vs `.sass` syntax
- **Include Paths**: Supports custom include paths for imports
- **Global Injection**: Can inject global Sass files into all components
- **Module Resolution**: Supports `~` prefix for node_modules imports
- **Source Maps**: Generates source maps for debugging
- **Error Reporting**: Provides detailed error diagnostics

## Common Development Tasks

### Adding New Plugin Options

1. Add the option to `PluginOptions` interface in `src/declarations.ts`
2. Update `getRenderOptions()` in `src/util.ts` to handle the new option
3. Add tests in `test/utils.spec.ts`
4. Update documentation

### Debugging Build Issues

- Use `npm run watch` for continuous building during development
- Check the `dist/` directory for build output
- Verify TypeScript compilation with `tsc --noEmit`

### Testing with a Real Stencil Project

1. Build the plugin: `npm run build`
2. In your Stencil project: `npm link /path/to/sass`
3. Test your changes in a real-world scenario

## Release Process

### Development Releases

Development Releases (or "Dev Releases", "Dev Builds") are installable instances of Stencil Sass that are:
- Published to the npm registry for distribution within and outside the Stencil team
- Built using the same infrastructure as production releases, with less safety checks
- Used to verify a fix or change to the project prior to a production release

#### How to Publish

Only members of the Stencil team may create dev builds of Stencil Sass.
To publish the package:
1. Navigate to the [Stencil Sass Dev Release GitHub Action](https://github.com/stenciljs/sass/actions/workflows/release-dev.yml) in your browser.
2. Select the 'Run Workflow' dropdown on the right hand side of the page
3. The dropdown will ask you for a branch name to publish from. Any branch may be used here.
4. Select 'Run Workflow'
5. Allow the workflow to run. Upon completion, the output of the 'publish-npm' action will report the published version string.

Following a successful run of the workflow, the package can be installed from the npm registry like any other package.

#### Publish Format

Dev Builds are published to the NPM registry under the `@stencil/sass` scope.
Unlike production builds, dev builds use a specially formatted version string to express its origins.
Dev builds follow the format `BASE_VERSION-dev.EPOCH_DATE.SHA`, where:
- `BASE_VERSION` is the latest production release changes to the build were based off of
- `EPOCH_DATE` is the number of seconds since January 1st, 1970 in UTC
- `SHA` is the git short SHA of the commit used in the release

As an example: `2.1.0-dev.1677185104.7c87e34` was built:
- With v2.1.0 as the latest production build at the time of the dev build
- On Fri, 26 Jan 2024 13:48:17 UTC
- With the commit `7c87e34`

### Production Release

Production releases of Stencil Sass are handled by maintainers and follow a more controlled process than development releases.

#### How to Publish

Only members of the Stencil team may create production releases of Stencil Sass.
To publish a production release:

1. Navigate to the [Stencil Sass Release GitHub Action](https://github.com/stenciljs/sass/actions/workflows/release.yml) in your browser.
2. Select the 'Run Workflow' dropdown on the right hand side of the page
3. Choose the appropriate version bump type:
   - **Patch** (`x.x.X`): Bug fixes, documentation updates, or other non-breaking changes
   - **Minor** (`x.X.x`): New features that are backward compatible
   - **Major** (`X.x.x`): Breaking changes that are not backward compatible
4. The workflow will typically run from the `main` branch
5. Select 'Run Workflow'
6. Allow the workflow to run. Upon completion, a new version will be published to npm and a GitHub release will be created.

#### Version Bump Guidelines

When choosing the version bump type, consider:

- **Patch Release** (1.0.X): Use for bug fixes, security patches, documentation improvements, or internal refactoring that doesn't affect the public API
- **Minor Release** (1.X.0): Use for new features, new plugin options, or enhancements that maintain backward compatibility
- **Major Release** (X.0.0): Use for breaking changes such as:
  - Removing or changing existing plugin options
  - Changing the plugin's public API
  - Dropping support for older Stencil versions
  - Significant changes to the build output or behavior

Production releases follow semantic versioning and are published as stable versions without special version suffixes.

## Getting Help

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/stenciljs/sass/issues)
- **Discussions**: Ask questions in [Stencil Discord](https://chat.stenciljs.com/)
- **Documentation**: Check the [README](./readme.md) for usage information

## Additional Resources

- [Stencil Documentation](https://stenciljs.com/)
- [Sass Documentation](https://sass-lang.com/)
- [sass-embedded Package](https://www.npmjs.com/package/sass-embedded)
- [Stencil Plugin Development](https://stenciljs.com/docs/plugins)

Thank you for contributing to @stencil/sass! 🎉 