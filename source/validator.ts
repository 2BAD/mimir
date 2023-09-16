import { containsIdenticalTranslation } from '~/rules.js'
import { type Translator } from '~/types.js'

// eslint-disable-next-line jsdoc/require-jsdoc
export const validateTranslations = (
  translator: Translator,
  keys: string[]
  // targetLocale?: string
): Array<Record<string, string>> => {
  const errors: Array<Record<string, string>> = []
  for (const key of keys) {
    const translations = translator.getTranslations(key)
    if (translations !== null) {
      const result = containsIdenticalTranslation(translations)
      if (result !== false) errors.push(result)
      // add some more tests below in a similar fashion
      // ...
    }
  }

  return errors
}
