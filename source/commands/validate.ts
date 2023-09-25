/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jsdoc/require-jsdoc */
import { Command, Flags } from '@oclif/core'
import { initTranslator } from '~/translator.js'
import { initValidator } from '~/validator.js'

// eslint-disable-next-line import/no-default-export
export default class Validate extends Command {
  static override description = 'Validate translation files'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    path: Flags.string({ char: 'p', summary: 'path to translation folder', default: process.cwd() }),
    rules: Flags.string({
      char: 'r',
      summary: 'list of rules to run',
      parse: async (input) => {
        let rules = input.split(', ')
        if (rules.length === 1) {
          rules = input.split(',')
        }
        return rules
      }
    })
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Validate)

    const translator = initTranslator(flags.path)
    const validator = await initValidator(translator, flags.rules)

    this.log(validator.run())
  }
}