import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { HookType, Module, Rule } from '~/types.js'
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
      hooks: z.array(HookType).parse(Object.keys(rule.create()))
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
  const rulesDir = new URL('rules', import.meta.url)
  debug('searching for rules in: %o', rulesDir.pathname)

  const files = await readdir(rulesDir, {
    withFileTypes: true
  })

  const rulePromises = files
    .filter(
      (file) =>
        file.isFile() && (file.name.endsWith('.js') || (file.name.endsWith('.ts') && !file.name.includes('.test.')))
    )
    .map((file) => ({
      ruleId: path.parse(file.name).name,
      rulePath: path.join(file.path, file.name)
    }))
    .filter(({ ruleId }) => !rulesToLoad || rulesToLoad.includes(ruleId))
    .map(async ({ ruleId, rulePath }) => {
      debug('rule found: %o', ruleId)

      return [ruleId, await loadRule(rulePath)]
    })

  const loadedRules = await Promise.all(rulePromises)
  debug('rules loaded: %o', loadedRules.length)

  const rulesMap = z.record(Rule).parse(Object.fromEntries(loadedRules))

  return rulesMap
}
