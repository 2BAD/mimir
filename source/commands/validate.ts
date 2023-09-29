/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jsdoc/require-jsdoc */
import { Command, Flags } from '@oclif/core'
import { readFileSync } from 'node:fs'
import * as format from '~/formatters/format.js'
import { initTranslator } from '~/translator.js'
import { initValidator } from '~/validator.js'

// eslint-disable-next-line import/no-default-export
export default class Validate extends Command {
  static override description = 'Validate translation files'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    path: Flags.string({ char: 'p', summary: 'path to translation folder', default: process.cwd() }),
    rules: Flags.string({ char: 'r', summary: 'This option specifies the rules to be used.' }),
    keys: Flags.string({ char: 'k', summary: 'This option specifies the keys to be scanned.' }),
    format: Flags.string({
      char: 'f',
      summary: 'This option specifies the output format for the console.',
      default: 'json'
    })
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Validate)

    const parseFlags = (input?: string): string[] | undefined => {
      let rules
      if (input !== undefined) {
        rules = input.split(', ')
        if (rules.length === 1) {
          rules = input.split(',')
        }
      }
      return rules
    }

    let keys: string[] = []
    if (flags.keys !== undefined) {
      keys = JSON.parse(readFileSync(flags.keys, { encoding: 'utf-8' })) as string[]
    }

    const translator = initTranslator(flags.path)
    const validator = await initValidator(translator, parseFlags(flags.rules))

    const report = validator.run(keys)

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
