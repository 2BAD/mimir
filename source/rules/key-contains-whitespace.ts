import { type Context, type LifeCycleTriggers, type Rule } from '~/rules/utils/types.js'

const MESSAGE_ID = 'key-contains-whitespace'
const messages = {
  [MESSAGE_ID]: 'Unexpected whitespace character in key.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleTriggers => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onKey = (context: Context): void => {
    const regex = /\s/

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
      description:
        'Notify if translation key contains whitespace character (space (␣), the tab (\t), the new line (\n) and the carriage return (\r)).'
    },
    messages
  }
}
