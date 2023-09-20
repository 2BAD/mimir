/* eslint-disable jsdoc/require-jsdoc */
import { loadRules } from '~/rules/utils/loader.js'
import { type Translator, type Validator } from '~/types.js'
import { initRunner } from './rules/utils/runner.js'
import { type Problem } from './rules/utils/types.js'

export const initValidator = async (translator: Translator, ruleIds?: string[]): Promise<Validator> => {
  const rules = await loadRules(ruleIds)

  const ruleRunner = initRunner(rules)

  const validate = (keys?: string[]): Problem[] => {
    if (keys === undefined || keys?.length === 0) {
      keys = translator.getKeys()
    }

    for (const key of keys) {
      // run onKey
      ruleRunner.run('onKey', { key })

      const translations = translator.getTranslations(key)
      if (translations !== null) {
        // run OnTranslations
        ruleRunner.run('OnTranslations', { key, translations })

        for (const value of Object.values(translations)) {
          // run OnValues
          ruleRunner.run('OnValue', { key, translations, value })
        }
      }
    }

    return ruleRunner.getProblems()
  }

  return {
    validate
  }
}
