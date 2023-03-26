# ast-to-entity-definitions

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/HiromiShikata/ast-to-entity-definitions/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/HiromiShikata/ast-to-entity-definitions/tree/main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Usage

### Cli

```
npx ast-to-entity-definitions ./src/domain/entities
```

### Function

```
import { getEntityDefinitions } from "ast-to-entity-definitions/bin/adapter/entry-points/function/index";
console.log(getEntityDefinitions(path));
```
