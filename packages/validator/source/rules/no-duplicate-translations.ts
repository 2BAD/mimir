/* eslint-disable jsdoc/require-jsdoc */
import { type LifeCycleHooks, type OnTranslationsHook, type Rule } from '~/rules/utils/types.js'

const type = 'notice'
const MESSAGE_ID = 'no-duplicate-translations'
const messages = {
  [MESSAGE_ID]: 'Key has multiple identical translations.'
}

const create = (): LifeCycleHooks => {
  const onTranslations: OnTranslationsHook = ({ report, filePath, key, translations }) => {
    const values = Object.values(translations)
    const fm = values.reduce((m, v) => {
      if (m.has(v)) {
        m.set(v, m.get(v) + 1)
      } else {
        m.set(v, 1)
      }
      return m
    }, new Map())

    const locales: string[] = Object.entries(translations)
      .filter(([_, t]) => fm.get(t) > 1)
      .map((e) => e[0])

    if (locales.length > 0 && locales.includes('en')) {
      report({
        filePath,
        key,
        type,
        messageId: MESSAGE_ID,
        message: `Following locales have the same translation: ${locales.toString()} - ${translations.en}`
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
    type,
    messages,
    docs: {
      description: 'Notify if the translations for a specific key are identical.'
    }
  }
}
