/* eslint-disable jsdoc/require-jsdoc */
import { loadRules } from '~/rules/utils/loader.js'
import {
  LifeCycleHooks,
  type Context,
  type ContextParameters,
  type HookType,
  type Problem,
  type Runner,
  type RunnerGetProblemsFn,
  type RunnerInitFn,
  type RunnerTriggerFn
} from '~/rules/utils/types.js'

export const initRunner: RunnerInitFn = async (ruleIds?: string[]): Promise<Runner> => {
  const rules = await loadRules(ruleIds)
  const rulesMap = new Map<HookType, LifeCycleHooks[]>()
  const problems: Problem[] = []

  // Initialize rules and store them in a map with hook as key
  Object.values(rules).forEach((rule) => {
    rule.meta.hooks?.forEach((hook) => {
      if (!rulesMap.has(hook)) {
        rulesMap.set(hook, [])
      }
      const lc = LifeCycleHooks.parse(rule.create())
      rulesMap.get(hook)?.push(lc)
    })
  })

  const trigger: RunnerTriggerFn = (hook: HookType, contextParams: ContextParameters): void => {
    const triggered = rulesMap.get(hook)
    if (triggered) {
      triggered.forEach((rule) => {
        if (rule[hook] !== undefined && typeof rule[hook] === 'function') {
          const c = createContext(contextParams)
          rule[hook](с)
        }
      })
    }
  }

  const createContext = (params: ContextParameters): Context => {
    return {
      ...params,
      // eslint-disable-next-line jsdoc/require-jsdoc
      report: (problem: Problem): void => {
        problems.push(problem)
      }
    }
  }

  const getProblems: RunnerGetProblemsFn = (): Problem[] => {
    return problems
  }

  return {
    trigger,
    getProblems
  }
}
