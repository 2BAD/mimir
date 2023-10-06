import { type Problem } from '@2bad/mimir-validator'

/**
 * Capitalizes the first character of a string.
 *
 * @param s - The string to capitalize.
 * @returns The capitalized string.
 */
const capitalize = (s: string | undefined): string => (s?.[0] !== undefined ? s[0].toUpperCase() + s.slice(1) : '')

/**
 * Combines the report of problems into a compact string representation.
 *
 * @param report - The array of problem objects to process.
 * @param workingDir - The working directory.
 * @returns The compact string representation of the report.
 */
export const compact = (report: Problem[], workingDir: string): string => {
  let output = ''
  let total = 0

  workingDir += workingDir.endsWith('/') ? '' : '/'

  report.forEach((problem) => {
    output += `${problem.filePath?.replace(workingDir, './')}: `
    output += `${capitalize(problem.type)} - ${problem.message}`
    output += ` (${problem.messageId}) \n`

    total++
  })

  if (total > 0) {
    output += `\n${total} problem${total !== 1 ? 's' : ''}`
  }

  return output
}
