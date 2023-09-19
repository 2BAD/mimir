import { z } from 'zod'

/**
 * Represents a report object.
 *
 * message - The problem message.
 *
 * messageId - You can use messageIds instead of typing out messages to avoid retyping errors and prevent outdated messages in different sections of your rule.
 *
 * filename - Optional filename related to the problem.
 */
export const Problem = z.object({
  message: z.string().optional(),
  messageId: z.string().optional(),
  filename: z.string().optional()
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Problem = z.infer<typeof Problem>

export const Report = z.function().args(Problem).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Report = z.infer<typeof Report>

/**
 * The rule context object.
 *
 * id - The rule ID.
 *
 * filename - The filename associated with the translation.
 *
 * cwd - The cwd option passed to the Translator. It is a path to a directory that should be considered the current working directory.
 *
 * options - The shared settings from the configuration.
 */
export const Context = z.object({
  id: z.string(),
  filename: z.string(),
  cwd: z.string(),
  options: z.record(z.string()),
  report: Report
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Context = z.infer<typeof Context>

const Types = {
  Problem: 'problem',
  Suggestion: 'suggestion',
  Notice: 'notice'
} as const

const Type = z.nativeEnum(Types)
// eslint-disable-next-line @typescript-eslint/no-redeclare
type Type = z.infer<typeof Type>

export const Create = z.function().args(Context).returns(z.void())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Create = z.infer<typeof Create>

export const Rule = z.object({
  meta: z.object({
    type: Type,
    docs: z.object({
      description: z.string(),
      url: z.string().optional()
    }),
    messages: z.record(z.string())
  }),
  create: Create
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Rule = z.infer<typeof Rule>

export const Module = z.object({ rule: Rule })
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Module = z.infer<typeof Module>

export const RulesMap = z.record(Rule)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RulesMap = z.infer<typeof RulesMap>
