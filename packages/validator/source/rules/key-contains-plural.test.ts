import { rule } from '~/rules/key-contains-plural.js'

describe('create', () => {
  it('should report when key contains "plural" keyword', () => {
    const filePath = 'path/to/file'
    const key = 'some_plural_key'
    const report = vi.fn()

    const hooks = rule.create()
    hooks.onKey({ report, filePath, key })

    expect(report).toHaveBeenCalledWith({
      filePath,
      key,
      type: 'notice',
      messageId: 'key-contains-plural'
    })
  })

  it('should not report when key does not contain "plural" keyword', () => {
    const filePath = 'path/to/otherFile'
    const key = 'some_other_key'
    const report = vi.fn()

    const hooks = rule.create()
    hooks.onKey({ report, filePath, key })

    expect(report).not.toHaveBeenCalled()
  })
})
