# Mimir

Translation and validation toolkit.

- [Usage](#usage)
- [Commands](#commands)

# Usage

```sh-session
$ npm install -g @2bad/mimir
$ mimir --version
@2bad/mimir/1.0.0 wsl-x64 node-v20.7.0
$ mimir validate --help
Validate translation files

USAGE
  $ mimir validate [-p <value>] [-r <value>] [-f <value>]
...
```

# Commands

- [`mimir validate`](#mimir-validate)

## `mimir validate`

Validate translation files

```
USAGE
  $ mimir validate [-p <value>] [-r <value>] [-f <value>]

FLAGS
  -f, --format=<value>  [default: json] This option specifies the output format for the console.
  -p, --path=<value>    [default: /home/projects/miro/mimir] path to translation folder
  -r, --rules=<value>   This option specifies the rules to be used.

DESCRIPTION
  Validate translation files

EXAMPLES
  $ mimir validate
```
