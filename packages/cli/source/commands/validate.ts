/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jsdoc/require-jsdoc */
import { initTranslator, type Locale } from '@2bad/mimir-translator'
import { initValidator } from '@2bad/mimir-validator'
import { Command, Flags } from '@oclif/core'
import { readFileSync } from 'node:fs'
import * as format from '~/formatters/format.js'

// eslint-disable-next-line import/no-default-export
export default class Validate extends Command {
  static override description = 'Validate translation files'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    path: Flags.string({ char: 'p', summary: 'path to translation folder', default: process.cwd() }),
    locales: Flags.string({ char: 'l', summary: 'This option specifies the locales to be used.' }),
    rules: Flags.string({ char: 'r', summary: 'This option specifies the rules to be used.' }),
    keys: Flags.string({ char: 'k', summary: 'This option specifies the keys to be scanned.' }),
    ignoreKeys: Flags.string({ char: 'i', summary: 'This option specifies the keys to be ignored.' }),
    outputFile: Flags.string({
      char: 'o',
      summary: 'This option specifies the name of the file where report should be saved'
    }),
    format: Flags.string({
      char: 'f',
      summary: 'This option specifies the output format for the console.',
      default: 'json'
    })
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Validate)

    const parseFlags = (input?: string): string[] | undefined => {
      let arr
      if (input !== undefined) {
        arr = input.split(', ')
        if (arr.length === 1) {
          arr = input.split(',')
        }
      }
      return arr
    }

    let keys: string[] = []
    if (flags.keys !== undefined) {
      keys = JSON.parse(readFileSync(flags.keys, { encoding: 'utf-8' })) as string[]
    }

    let keysToIgnore: string[] = []
    if (flags.ignoreKeys !== undefined) {
      keysToIgnore = JSON.parse(readFileSync(flags.ignoreKeys, { encoding: 'utf-8' })) as string[]
    }

    const translator = initTranslator(flags.path, parseFlags(flags.locales) as Locale[])
    const validator = await initValidator(translator, parseFlags(flags.rules))

    const report = validator.run(keys, keysToIgnore)

    switch (flags.format) {
      case 'json':
        this.log(format.json(report))
        break
      case 'compact':
        this.log(format.compact(report, flags.path))
        break
      case 'stylish':
        this.log(format.stylish(report, flags.path))
        break
      default:
        break
    }
  }
}
