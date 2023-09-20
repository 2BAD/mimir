import { type Context, type LifeCycleTriggers, type Rule } from '~/rules/utils/types.js'

const MESSAGE_ID = 'no-duplicate-translations'
const messages = {
  [MESSAGE_ID]: 'Key has multiple identical translations.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleTriggers => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onTranslations = (context: Context): void => {
    const values = Object.values(context.translations)
    const fm = values.reduce((m, v) => {
      if (m.has(v)) {
        m.set(v, m.get(v) + 1)
      } else {
        m.set(v, 1)
      }
      return m
    }, new Map())

    const locales: string[] = Object.entries(context.translations)
      .filter(([_, t]) => fm.get(t) > 1)
      .map((e) => e[0])

    if (locales.length > 0) {
      context.report({
        // key,
        messageId: MESSAGE_ID,
        // path: translations.path,
        // translation: translations[locales[0] as Locale] as string,
        message: `Following locales have the same translation: ${locales.toString()}`
      })
    }
  }

  return {
    onTranslations
  }
}

export const rule: Rule = {
  create,
  meta: {
    type: 'notice',
    docs: {
      description: 'Notify if the translations for a specific key are identical.'
    },
    messages
  }
}
