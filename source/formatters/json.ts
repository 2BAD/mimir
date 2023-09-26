import { type Problem } from '~/rules/utils/types.js'

/**
 * Outputs JSON-serialized results.
 *
 * @param report - The array of Problem objects.
 * @returns - The JSON string representation of the report.
 */
export const json = (report: Problem[]): string => {
  return JSON.stringify(report, null, 2)
}
