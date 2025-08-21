# ast-to-entity-definitions 🚀

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/HiromiShikata/ast-to-entity-definitions/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/HiromiShikata/ast-to-entity-definitions/tree/main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Welcome to `ast-to-entity-definitions`! 🎉 This tool lets you easily generate EntityDefinition and EntityPropertyDefinition from your TypeScript type information. By doing this, you can streamline the process of source code generation!

## 📚 Table of Contents

- [Getting Started](#getting-started-rocket)
- [Usage](#usage-wrench)
  - [CLI](#cli)
  - [Function](#function)
- [Examples](#examples-mag)
- [Contributing](#contributing-hammer_and_wrench)
- [Commit Message Guidelines](#commit-message-guidelines-memo)
- [License](#license-scroll)

## Getting Started 🚀

You can start using `ast-to-entity-definitions` by installing it via npm:

```bash
npm install ast-to-entity-definitions
```

Or if you prefer Yarn:

```bash
yarn add ast-to-entity-definitions
```

## Usage 🛠️

### CLI

You can use the CLI to generate the EntityDefinition and EntityPropertyDefinition like so:

```bash
npx ast-to-entity-definitions ./src/domain/entities
```

### Function

Alternatively, you can import the `getEntityDefinitions` function and use it in your own scripts:

```typescript
import { getEntityDefinitions } from 'ast-to-entity-definitions/bin/adapter/entry-points/function/index';
console.log(getEntityDefinitions(path));
```

## Examples 🔍

This example shows you the output of running `ast-to-entity-definitions` against a TypeScript file. This is a JSON representation of the EntityDefinition and EntityPropertyDefinition for each type:

```javascript
import { execSync } from 'child_process';

describe('commander program', () => {
  it('should output file contents', () => {
    const output = execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts ./testdata/src/domain/entities',
    ).toString();

    console.log(output.trim());
  });
});
```

This example creates EntityDefinitions for a `Administrator`, `Group`, `Item`, `User`, `UserAddress`, and `UserGroup` types.

## Contributing 🔨⌨️

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/HiromiShikata/ast-to-entity-definitions/issues).

## Commit Message Guidelines 📝

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages are automatically validated by commitlint in GitHub Actions.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Available Types

| Type       | Description                                                   | Example                               |
| ---------- | ------------------------------------------------------------- | ------------------------------------- |
| `feat`     | A new feature                                                 | `feat: add new entity parser`         |
| `fix`      | A bug fix                                                     | `fix: resolve type inference issue`   |
| `docs`     | Documentation only changes                                    | `docs: update README examples`        |
| `style`    | Changes that do not affect the meaning of the code            | `style: fix indentation`              |
| `refactor` | A code change that neither fixes a bug nor adds a feature     | `refactor: extract utility function`  |
| `perf`     | A code change that improves performance                       | `perf: optimize AST parsing`          |
| `test`     | Adding missing tests or correcting existing tests             | `test: add unit tests for repository` |
| `build`    | Changes that affect the build system or external dependencies | `build: update typescript version`    |
| `ci`       | Changes to CI configuration files and scripts                 | `ci: add new workflow`                |
| `chore`    | Other changes that don't modify src or test files             | `chore: update dependencies`          |
| `revert`   | Reverts a previous commit                                     | `revert: revert feat: add parser`     |
| `autogen`  | Auto-generated code changes                                   | `autogen: update generated types`     |
| `prep`     | Preparation work                                              | `prep: setup project structure`       |
| `adapt`    | Adaptation or adjustment changes                              | `adapt: adjust for new API`           |

### Examples

```bash
# Feature addition
feat: add support for intersection types

# Bug fix with scope
fix(parser): handle undefined type references

# Documentation update
docs: add commit message guidelines to README

# Breaking change
feat!: change API signature for getEntityDefinitions

BREAKING CHANGE: getEntityDefinitions now requires options parameter
```

### Pull Request Requirements

This project uses GitHub Actions to check that pull requests are properly linked to issues. To pass the "Check linked issues in pull requests" validation, you must link your PR to an existing GitHub issue.

**How to link your PR to an issue (choose one method):**

1. **In your PR description** (recommended), include one of these keywords followed by the issue number:

   ```
   Fixes #123
   Closes #456
   Resolves #789
   ```

2. **OR in your commit messages**:

   ```bash
   feat: add new parser functionality

   This commit implements the new parser as requested.

   Fixes #123
   ```

3. **OR using GitHub UI**: You can also link issues manually in the GitHub web interface by clicking "Link an issue" in the PR sidebar.

**Note:** You only need to use ONE of these methods to link your PR to an issue.

**Supported linking keywords:**

- `Fixes #issue-number` - Links and closes the issue when PR is merged
- `Closes #issue-number` - Links and closes the issue when PR is merged
- `Resolves #issue-number` - Links and closes the issue when PR is merged
- `Fix #issue-number` - Links and closes the issue when PR is merged
- `Close #issue-number` - Links and closes the issue when PR is merged
- `Resolve #issue-number` - Links and closes the issue when PR is merged

**For reference only (doesn't close the issue):**

- `Refs #issue-number`
- `References #issue-number`
- `See #issue-number`

**Note:** The linked issue check is currently disabled in this repository (`if: false` in the workflow), but these guidelines should be followed as a best practice and in case the check is enabled in the future.

## License 📜

`ast-to-entity-definitions` is [MIT licensed](https://github.com/HiromiShikata/ast-to-entity-definitions/blob/main/LICENSE).

---

Give a ⭐️ if this project helped you!
