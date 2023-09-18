#!/usr/bin/env node
/* eslint-disable vitest/require-hook */
// eslint-disable-next-line n/shebang
import meow from 'meow'
import { initTranslator } from './translator.js'
import { type Locale } from './types.js'
import { validateTranslations } from './validator.js'

const cli = meow(
  `
  Usage
  $ mimir translate -p <path> -k <key>
  $ mimir translate -p <path> -k <key> -l <locale?>

  $ mimir validate -p <path>
  $ mimir validate -p <path> -k <key>
  $ mimir validate -p <path> -f <file>

  Options
    --path, -p     Path to translation folder
    --key, -k      A key to translate
    --locale, -l   Comma separated list of locales to process (eg: en,de)
    --file, -f     Path to files that contains keys to validate
    --output,  -o   Path to output file (result.json by default)

  Examples
    $ mimir validate -p /home/client/ -k "settings.title"
`,
  {
    importMeta: import.meta,
    flags: {
      path: {
        type: 'string',
        shortFlag: 'p',
        isRequired: true
      },
      key: {
        type: 'string',
        shortFlag: 'k'
      },
      locale: {
        type: 'string',
        shortFlag: 'l'
      },
      file: {
        type: 'string',
        shortFlag: 'f'
      },
      output: {
        type: 'string',
        shortFlag: 'o'
      }
    }
  }
)

if (cli.input.at(0) === 'translate') {
  console.log('Translating!', cli.flags)
  const translator = initTranslator(cli.flags.path, cli.flags.locale?.split(',') as Locale[])
  if (cli.flags.locale !== undefined) {
    console.log(translator.getText(cli.flags.locale as Locale, cli.flags.key ?? ''))
  } else if (cli.flags.key !== undefined) {
    console.log(translator.getTranslations(cli.flags.key))
  }
}
if (cli.input.at(0) === 'validate') {
  console.log('Validating!', cli.flags)
  const translator = initTranslator(cli.flags.path, cli.flags.locale?.split(',') as Locale[])
  console.log(validateTranslations(translator, cli.flags.key !== undefined ? cli.flags.key.split(',') : undefined))
}
