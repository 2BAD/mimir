import { type LifeCycleHooks, type OnValueHook, type Rule } from '~/types.js'

const type = 'notice'
const MESSAGE_ID = 'value-contains-html-tags'
const messages = {
  [MESSAGE_ID]: 'Translation value contains HTML tags.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleHooks => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onValue: OnValueHook = ({ report, filePath, key, value }) => {
    const regex = /<[^>]*>/i

    if (regex.test(value)) {
      report({
        filePath,
        key,
        value,
        type,
        messageId: MESSAGE_ID
      })
    }
  }

  return {
    onValue
  }
}

export const rule: Rule = {
  create,
  meta: {
    type,
    messages,
    docs: {
      description: 'Notify if translation string contains HTML tags.'
    }
  }
}
