import { type Context, type LifeCycleTriggers, type Rule } from '~/rules/utils/types.js'

const MESSAGE_ID = 'key-contains-plural'
const messages = {
  [MESSAGE_ID]: 'Translation key contains "plural" keyword.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleTriggers => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onKey = (context: Context): void => {
    const regex = /plural/i

    if (regex.test(context.key)) {
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
      description: 'Notify if translation key contains "plural" keyword.'
    },
    messages
  }
}
