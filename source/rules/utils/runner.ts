/* eslint-disable jsdoc/require-jsdoc */
import { loadRules } from '~/rules/utils/loader.js'
import {
  HookType,
  LifeCycleHooks,
  OnKeyContext,
  OnKeyHook,
  OnTranslationsContext,
  OnTranslationsHook,
  OnValueContext,
  OnValueHook,
  ReportContext,
  type Context,
  type ContextParams,
  type Problem,
  type Runner,
  type RunnerCreateContextFn,
  type RunnerGetProblemsFn,
  type RunnerInitFn,
  type RunnerTriggerFn
} from '~/rules/utils/types.js'
const debug = (await import('debug')).default('runner')

export const initRunner: RunnerInitFn = async (ruleIds?: string[]): Promise<Runner> => {
  debug(`initializing rule runner with following rules '%o'`, ruleIds)

  const rules = await loadRules(ruleIds)
  const hooksMap = new Map<HookType, LifeCycleHooks[]>()
  const problems: Problem[] = []

  // Initialize rules and store them in a map with hook as key
  Object.values(rules).forEach((rule) => {
    rule.meta.hooks?.forEach((hook) => {
      if (!hooksMap.has(hook)) {
        hooksMap.set(hook, [])
      }
      const lc = LifeCycleHooks.parse(rule.create())
      hooksMap.get(hook)?.push(lc)
    })
  })

  for (const hook of HookType.options) {
    debug(`rules initialized for hook %o: %o`, hook, hooksMap.get(hook)?.length ?? 0)
  }

  const trigger: RunnerTriggerFn = (hook: HookType, params: ContextParams): void => {
    const triggered = hooksMap.get(hook)
    if (triggered) {
      debug(`triggered lifecycle hook: %o`, hook)
      triggered.forEach((rule) => {
        if (rule[hook] !== undefined && typeof rule[hook] === 'function') {
          if (hook === 'onKey') {
            const hookFn = OnKeyHook.parse(rule[hook])
            const context = OnKeyContext.and(ReportContext).parse(createContext(params))
            hookFn(context)
          } else if (hook === 'onTranslations') {
            const hookFn = OnTranslationsHook.parse(rule[hook])
            const context = OnTranslationsContext.and(ReportContext).parse(createContext(params))
            hookFn(context)
          } else if (hook === 'onValue') {
            const hookFn = OnValueHook.parse(rule[hook])
            const context = OnValueContext.and(ReportContext).parse(createContext(params))
            hookFn(context)
          }
        }
      })
    }
  }

  const createContext: RunnerCreateContextFn = (params: ContextParams): Context => {
    debug(`creating context using parameters: %o`, params)
    return {
      ...params,
      report: (problem: Problem): void => {
        debug(`rule reported a problem: %o`, problem)
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
