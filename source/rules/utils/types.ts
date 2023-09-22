import { z } from 'zod'
import { TranslationsMap } from '~/types.js'

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

export const BaseContext = z.object({
  filePath: z.string()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BaseContext = z.infer<typeof BaseContext>

export const OnKeyContext = BaseContext.and(
  z.object({
    key: z.string()
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OnKeyContext = z.infer<typeof OnKeyContext>

export const OnTranslationsContext = OnKeyContext.and(
  z.object({
    translations: TranslationsMap
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OnTranslationsContext = z.infer<typeof OnTranslationsContext>

export const OnValueContext = OnTranslationsContext.and(
  z.object({
    value: z.string()
  })
)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OnValueContext = z.infer<typeof OnValueContext>

export const ReportContext = z.object({
  report: ReportFn
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReportContext = z.infer<typeof ReportContext>

export const ContextParams = z.union([OnKeyContext, OnTranslationsContext, OnValueContext])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContextParams = z.infer<typeof ContextParams>

export const Context = ContextParams.and(ReportContext)
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

export const HookTypes = ['onKey', 'onTranslations', 'onValue'] as const

export const HookType = z.enum(HookTypes)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HookType = z.infer<typeof HookType>

export const OnKeyHook = z.function().args(OnKeyContext.and(ReportContext)).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OnKeyHook = z.infer<typeof OnKeyHook>

export const OnTranslationsHook = z.function().args(OnTranslationsContext.and(ReportContext)).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OnTranslationsHook = z.infer<typeof OnTranslationsHook>

export const OnValueHook = z.function().args(OnValueContext.and(ReportContext)).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OnValueHook = z.infer<typeof OnValueHook>

export const HookFn = z.union([OnKeyHook, OnTranslationsHook, OnValueHook])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HookFn = z.infer<typeof HookFn>

export const LifeCycleHooks = z.object({
  onKey: OnKeyHook.optional(),
  onTranslations: OnTranslationsHook.optional(),
  onValue: OnValueHook.optional()
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

export const RunnerTriggerFn = z.function().args(HookType, ContextParams).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RunnerTriggerFn = z.infer<typeof RunnerTriggerFn>

export const RunnerCreateContextFn = z.function().args(ContextParams).returns(Context)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RunnerCreateContextFn = z.infer<typeof RunnerCreateContextFn>

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
