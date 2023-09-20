import { type LifeCycleHooks, type Rule, type onKeyHook } from '~/rules/utils/types.js'

const MESSAGE_ID = 'no-untranslated-key'
const messages = {
  [MESSAGE_ID]: 'Translation key contains is empty.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleHooks => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onKey: onKeyHook = (context) => {
    if (context.key === '') {
      context.report({
        key: context.key,
        messageId: MESSAGE_ID
      })
    }
  }

  return {
    onKey
  }
}

export const rule: Rule = {
  create,
  meta: {
    type: 'notice',
    docs: {
      description: 'Notify if translation key is empty.'
    },
    messages
  }
}
