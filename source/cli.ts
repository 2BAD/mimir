#!/usr/bin/env node
/* eslint-disable vitest/require-hook */
// eslint-disable-next-line n/shebang
import meow from 'meow'

const cli = meow(
  `
  Usage
    $ mimir check <locale> <keys>

  Options
    --project, -p   Path to project
    --output,  -o   Path to output file (result.json by default)

  Examples
    $ mimir check fr "settings.title"
`,
  {
    importMeta: import.meta,
    flags: {
      project: {
        type: 'string',
        shortFlag: 'p'
      },
      output: {
        type: 'string',
        shortFlag: 'o'
      }
    }
  }
)

if (cli.input.at(0) === 'check') {
  console.log('Checking!', cli.flags)
}
