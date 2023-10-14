import { type LifeCycleHooks, type OnTranslationsHook, type Rule } from '~/types.js'

const type = 'notice'
const MESSAGE_ID = 'value-is-longer-than-default'
const messages = {
  [MESSAGE_ID]: 'Translated string is longer than original string.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleHooks => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onTranslations: OnTranslationsHook = ({ report, filePath, key, translations }) => {
    const ORIGINAL_LANG = 'en'
    const originalString = translations[ORIGINAL_LANG]

    if (originalString !== undefined) {
      const longTranslations = Object.entries(translations).filter((t) => t[1].length > originalString.length)

      if (longTranslations.length > 0) {
        longTranslations.forEach((t) => {
          report({
            filePath,
            key,
            type,
            value: t[1],
            messageId: MESSAGE_ID,
            message: `Translated string is longer in locale ${t[0]}`
          })
        })
      }
    }
  }

  return {
    onTranslations
  }
}

export const rule: Rule = {
  create,
  meta: {
    type,
    messages,
    docs: {
      description: 'Notify if translation string is longer than original string.'
    }
  }
}
