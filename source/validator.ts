import { initRunner } from '~/rules/utils/runner.js'
import { type Problem } from '~/rules/utils/types.js'
import { type Translator, type Validator } from '~/types.js'

/**
 * Initialize the validator.
 *
 * @param translator - The translator object.
 * @param [ruleIds] - Optional array of rule IDs to initialize the runner with.
 * @returns The initialized validator object.
 */
export const initValidator = async (translator: Translator, ruleIds?: string[]): Promise<Validator> => {
  const ruleRunner = await initRunner(ruleIds)

  /**
   * Run the validation process.
   *
   * @param [keys] - Optional array of translation keys to run the validation on. If not provided, it runs on all translation keys.
   * @returns An array of problems encountered during the validation process.
   */
  const run = (keys?: string[]): Problem[] => {
    if (keys === undefined || keys?.length === 0) {
      keys = translator.getKeys()
    }

    for (const key of keys) {
      const filePath = translator.findTranslationsFolder(key)
      // run onKey
      ruleRunner.trigger('onKey', { filePath, key })

      const translations = translator.getTranslations(key)
      if (translations !== null) {
        // run OnTranslations
        ruleRunner.trigger('onTranslations', { filePath, key, translations })

        for (const value of Object.values(translations)) {
          // run OnValues
          ruleRunner.trigger('onValue', { filePath, key, translations, value })
        }
      }
    }

    return ruleRunner.getProblems()
  }

  return {
    run
  }
}
