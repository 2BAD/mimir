import { type LifeCycleHooks, type OnKeyHook, type Rule } from '~/types.js'

const type = 'notice'
const MESSAGE_ID = 'key-contains-plural'
const messages = {
  [MESSAGE_ID]: 'Translation key contains "plural" keyword.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleHooks => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onKey: OnKeyHook = ({ report, filePath, key }) => {
    const regex = /plural/i

    if (regex.test(key)) {
      report({
        filePath,
        key,
        type,
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
    type,
    messages,
    docs: {
      description: 'Notify if translation key contains "plural" keyword.'
    }
  }
}
