import { loadRule, loadRules } from '~/rules/utils/loader.js'
import { type Rule } from '~/rules/utils/types.js'

describe('loadRule', () => {
  it('should load a rule from a module', async () => {
    expect.assertions(3)

    const rulesDir = new URL('..', import.meta.url)
    const modulePath = `${rulesDir.href}/key-contains-whitespace`

    const rule: Rule = await loadRule(modulePath)

    expect(rule).toBeDefined()
    expect(rule.meta).toBeDefined()
    expect(rule.create).toBeDefined()
  })
})

describe('loadRules', () => {
  it('should load all rules if no rulesToLoad are provided', async () => {
    expect.assertions(2)
    const rulesMap = await loadRules()

    expect(rulesMap).toBeDefined()
    expect(Object.keys(rulesMap).length).toBeGreaterThan(0)
  })

  it('should load only specified rules if rulesToLoad are provided', async () => {
    expect.assertions(4)
    const rulesToLoad = ['key-contains-whitespace', 'key-contains-plural']

    const rulesMap = await loadRules(rulesToLoad)
    console.log(rulesMap)

    expect(rulesMap).toBeDefined()
    expect(Object.keys(rulesMap)).toHaveLength(rulesToLoad.length)

    for (const ruleId of rulesToLoad) {
      expect(rulesMap[ruleId]).toBeDefined()
    }
  })
})
