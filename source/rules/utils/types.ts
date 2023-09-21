import { z } from 'zod'

/**
 * Represents a report object.
 *
 * message - The problem message.
 *
 * messageId - You can use messageIds instead of typing out messages to avoid retyping errors and prevent outdated messages in different sections of your rule.
 *
 * filePath - Optional filePath related to the problem.
 */
export const Problem = z.object({
  message: z.string().optional(),
  messageId: z.string().optional(),
  filePath: z.string().optional(),
  key: z.string().optional()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Problem = z.infer<typeof Problem>

export const ReportFn = z.function().args(Problem).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReportFn = z.infer<typeof ReportFn>

/**
 * The rule context object.
 *
 * id - The rule ID.
 *
 * filePath - The filePath associated with the translation.
 *
 * cwd - The cwd option passed to the Translator. It is a path to a directory that should be considered the current working directory.
 *
 * options - The shared settings from the configuration.
 */
export const Context = z.object({
  id: z.string().optional(),
  filePath: z.string().optional(),
  key: z.string().optional(),
  cwd: z.string().optional(),
  options: z.record(z.string()).optional(),
  report: ReportFn
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Context = z.infer<typeof Context>

const RuleTypes = {
  Problem: 'problem',
  Suggestion: 'suggestion',
  Notice: 'notice'
} as const

const RuleType = z.nativeEnum(RuleTypes)
// eslint-disable-next-line @typescript-eslint/no-redeclare
type RuleType = z.infer<typeof RuleType>

const HookTypes = {
  OnKey: 'onKey',
  OnValue: 'onValue',
  OnTranslations: 'onTranslations'
} as const

export const HookType = z.nativeEnum(HookTypes)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HookType = z.infer<typeof HookType>

export const HookFn = z.function().args(Context).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HookFn = z.infer<typeof HookFn>

export const onKeyHook = z
  .function()
  .args(Context.required({ key: true }))
  .returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type onKeyHook = z.infer<typeof onKeyHook>

export const LifeCycleHooks = z.object({
  onKey: onKeyHook.optional(),
  onValue: HookFn.optional(),
  onTranslations: HookFn.optional()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LifeCycleHooks = z.infer<typeof LifeCycleHooks>

export const RuleInitFn = z.function().args().returns(LifeCycleHooks)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RuleInitFn = z.infer<typeof RuleInitFn>

export const Rule = z.object({
  meta: z.object({
    type: RuleType,
    docs: z.object({
      description: z.string(),
      url: z.string().optional()
    }),
    messages: z.record(z.string()),
    hooks: z.array(HookType).optional()
  }),
  create: RuleInitFn
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Rule = z.infer<typeof Rule>

export const Module = z.object({ rule: Rule })
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Module = z.infer<typeof Module>

export const RulesMap = z.record(Rule)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RulesMap = z.infer<typeof RulesMap>

export const LoaderLoadRuleFn = z.function().args(z.string()).returns(z.promise(Rule))
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LoaderLoadRuleFn = z.infer<typeof LoaderLoadRuleFn>

export const LoaderLoadRulesFn = z.function().args(z.array(z.string()).optional()).returns(z.promise(RulesMap))
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LoaderLoadRulesFn = z.infer<typeof LoaderLoadRulesFn>

export const RunnerTriggerFn = z.function().args(HookType, ContextParameters).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RunnerTriggerFn = z.infer<typeof RunnerTriggerFn>

export const RunnerGetProblemsFn = z.function().args().returns(z.array(Problem))
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RunnerGetProblemsFn = z.infer<typeof RunnerGetProblemsFn>

export const Runner = z.object({
  trigger: RunnerTriggerFn,
  getProblems: RunnerGetProblemsFn
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Runner = z.infer<typeof Runner>

export const RunnerInitFn = z.function().args(z.array(z.string()).optional()).returns(z.promise(Runner))
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RunnerInitFn = z.infer<typeof RunnerInitFn>
