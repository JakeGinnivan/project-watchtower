# API

## CLI

Project Watchtower exposes the `project-watchtower` and `pwt` executables

### build

```
pwt build [<target>] [<environment>]
```

* `target`: server, client
* `environment`: dev, prod

Leaving the target out builds both server and client.

Leaving the environment out builds for production by default

### start

```
pwt start [watch] [fast] [prod]
```

*   `watch`: Enable watch mode and rebuild client after changes
*   `fast`: Disable TypeScript type checking for faster incremental builds
*   `prod`: Set `NODE_ENV` to `"production"`

### Programmatic Usage

All CLI commands are available in `project-watchtower/lib/bin`. They take their parameters as strings:

```ts
import build from 'project-watchtower/lib/bin/build'

build('server', 'prod')
```

## JavaScript

All functional areas are available as a top-level import from the `project-watchtower` module. However, deep imports are preferred, which is especially important on the client where we don't want unnecessary code bundled up.

`project-watchtower/lib/build/assets`

```ts
getAssetLocations(): Assets

getCssAssetHtml(): string

getJsAssetHtml(): string

addAssetsToHtml(html: string): string
```

`project-watchtower/lib/build/build`

```ts
getWebpackConfig(
    target: BuildTarget,
    environment: BuildEnvironment
): webpack.Configuration

getDefaultWebpackConfig(
    target: BuildTarget,
    environment: BuildEnvironment
): webpack.Configuration
```

`project-watchtower/lib/build/extend`

```ts
extendWebpackConfig(
    baseConfig: webpack.Configuration,
    newConfig: Partial<webpack.Configuration>
): webpack.Configuration
```

### Types

`project-watchtower/lib/types`

*   `Assets`: Mapping of webpack assets to file locations
*   `Paths` / `PathsOverride`: Basic paths configuration for the project