import { type LifeCycleHooks, type OnValueHook, type Rule } from '~/rules/utils/types.js'

const type = 'notice'
const MESSAGE_ID = 'value-contains-apostrophe'
const messages = {
  [MESSAGE_ID]: 'Translation value contains apostrophes.'
}

// eslint-disable-next-line jsdoc/require-jsdoc
const create = (): LifeCycleHooks => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  const onValue: OnValueHook = ({ report, filePath, key, value }) => {
    const regex = /'/g

    if (regex.test(value)) {
      report({
        filePath,
        key,
        value,
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
      description: 'Notify if translation string contains apostrophe.'
    }
  }
}
