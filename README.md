# node-regctl

Easily install regctl on macOS, linux, and Windows.

Just run one of:

- `pnpm i -g regctl`
- `npm i -g regctl`
- `yarn global add regctl`

> Notice: The version of this package is not related to the version of `regctl` binary.
> This package always tries to use the latest version of `regctl` binary, but you can install a specific version of `regctl` by using `regctl bin install [version]`.

## Usage

You can find the usage of `regctl` here: <https://github.com/regclient/regclient/blob/main/docs/regctl.md>

Or just try:

```sh
regctl --help
```

### Extra: `bin` subcommand

There is an extra subcommand: `regctl bin`. You can use it to manage the regctl binary version.

```sh
❯ regctl bin --help
regctl bin                    : Prints the path to the binary
regctl bin remove             : Removes the binary
regctl bin install [version]  : Installs the binary
regctl bin help               : Prints this help message
Examples:
regctl bin install            : Installs the latest version of regctl
regctl bin install v0.4.4     : Installs regctl v0.4.4
You can find releases at https://github.com/regclient/regclient/releases
```

## Library Usage

### Binary Path & Install

```js
import { bin, install } from "regctl";
import fs from "node:fs";
import { spawn } from "node:child_process";
if (!fs.existsSync(bin)) {
    // install regctl binary
    await install(bin);
}
// run regctl
spawn(bin, ["version"], { stdio: "inherit" });
```

- `bin`: The path of the binary.
- `install`: A function that installs the binary to the given path.
