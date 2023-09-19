import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { Module, Rule } from './types.js'
const debug = (await import('debug')).default('loader')

/**
 * Load a rule from a module.
 *
 * @param modulePath - The path to the module.
 * @returns A promise that resolves with the loaded rule.
 */
export const loadRule = async (modulePath: string): Promise<Rule> => {
  const { rule } = Module.parse(await import(modulePath))

  return {
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs
      }
    },
    create: rule.create
  }
}

/**
 * Loads rules from a directory.
 *
 * @returns A promise that resolves to a map of rule IDs to loaded rules.
 */
export const loadRules = async (): Promise<Record<string, Rule>> => {
  const rulesDir = new URL('..', import.meta.url)
  debug('searching for rules in: %o', rulesDir.pathname)

  const files = await readdir(rulesDir, {
    withFileTypes: true
  })

  const rulePromises = files
    .filter((file) => file.isFile() && file.name.endsWith('.js'))
    .map(async (file) => {
      const ruleId = path.basename(file.name, '.js')
      const rulePath = path.join(file.path, file.name)
      debug('rule found: %o', ruleId)

      return [ruleId, await loadRule(rulePath)]
    })

  const rules = await Promise.all(rulePromises)
  debug('total number of loaded rules: %o', rules.length)

  const rulesMap = z.record(Rule).parse(Object.fromEntries(rules))

  return rulesMap
}
