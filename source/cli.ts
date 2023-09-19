#!/usr/bin/env node
/* eslint-disable vitest/require-hook */
// eslint-disable-next-line n/shebang
import meow from 'meow'
import fs from 'node:fs'
import { utils, writeFile } from 'xlsx'
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

/**
 *
 * @param data
 * @param outputPath
 */
const writeIntoXLSX = (data: Array<Record<string, string>>): void => {
  // Convert the JSON data to an array of objects
  // const dataForExcel = data.map((e) => ({
  //   Key: key,
  //   Value: data
  // }))

  // Create an Excel worksheet
  const worksheet = utils.json_to_sheet(data)

  // Create a workbook and add the worksheet
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Translations')

  // Write the Excel file
  writeFile(workbook, `./output.xlsx`)
}

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
  const result = validateTranslations(translator, cli.flags.key !== undefined ? cli.flags.key.split(',') : undefined)
  if (cli.flags.output === undefined) {
    console.log(result)
  } else {
    switch (cli.flags.output) {
      case 'json':
        fs.writeFileSync('./output.json', JSON.stringify(result, null, 2))
        break
      case 'xls':
        writeIntoXLSX(result)
        break
      default:
        break
    }
  }
}
