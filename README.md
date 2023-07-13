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

## License 📜

`ast-to-entity-definitions` is [MIT licensed](https://github.com/HiromiShikata/ast-to-entity-definitions/blob/main/LICENSE).

---

Give a ⭐️ if this project helped you!
