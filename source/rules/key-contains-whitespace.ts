import { type Context, type LifeCycleTriggers, type Rule } from '~/rules/utils/types.js'

const MESSAGE_ID = 'key-not-trimmed'
const messages = {
  [MESSAGE_ID]: 'Unexpected whitespace character in key.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (context: Context): LifeCycleTriggers => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onKey = (key: string): void => {
    const regex = /\s/

    if (regex.test(key)) {
      context.report({
        key,
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
      description:
        'Notify if translation key contains whitespace character (space (␣), the tab (\t), the new line (\n) and the carriage return (\r)).'
    },
    messages
  }
}
