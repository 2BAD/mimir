import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { Hook, Module, Rule } from './types.js'
const debug = (await import('debug')).default('loader')

/**
 * Load a rule from a module.
 *
 * @param modulePath - The path to the module.
 * @returns A promise that resolves with the loaded rule.
 */
export const loadRule = async (modulePath: string): Promise<Rule> => {
  // @todo: should wrap in try catch and improve error messages for lifecycle signature
  const { rule } = Module.parse(await import(modulePath))

  return {
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs
      },
      hooks: z.array(Hook).parse(Object.keys(rule.create()))
    },
    create: rule.create
  }
}

/**
 * Load rule modules from directory.
 *
 * @param [rulesToLoad] - An optional array of rule names to load. If not provided, all rules will be loaded.
 * @returns A promise that resolves to a map of rule names to their corresponding rule objects.
 */
export const loadRules = async (rulesToLoad?: string[]): Promise<Record<string, Rule>> => {
  const rulesDir = new URL('..', import.meta.url)
  debug('searching for rules in: %o', rulesDir.pathname)

  const files = await readdir(rulesDir, {
    withFileTypes: true
  })

  const rulePromises = files
    .filter((file) => file.isFile() && file.name.endsWith('.js'))
    .filter((file) => {
      const ruleId = path.basename(file.name, '.js')
      return !rulesToLoad || rulesToLoad.includes(ruleId)
    })
    .map(async (file) => {
      const ruleId = path.basename(file.name, '.js')
      const rulePath = path.join(file.path, file.name)
      debug('rule found: %o', ruleId)

      return [ruleId, await loadRule(rulePath)]
    })

  const loadedRules = await Promise.all(rulePromises)
  debug('total number of loaded rules: %o', loadedRules.length)

  const rulesMap = z.record(Rule).parse(Object.fromEntries(loadedRules))

  return rulesMap
}
