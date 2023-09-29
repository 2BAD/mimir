import chalk from 'chalk'
import Table from 'easy-table'
import { type Problem } from '~/rules/utils/types.js'

/**
 * Formats the report in a stylish manner.
 *
 * @param report - The list of problems to be formatted.
 * @param workingDir - The working directory path.
 * @returns The formatted report.
 */
export const stylish = (report: Problem[], workingDir: string): string => {
  const t = new Table()
  let output = '\n'
  let total = 0
  const problemsMap = new Map<string, Problem[]>()
  workingDir += workingDir.endsWith('/') ? '' : '/'

  for (const problem of report ?? []) {
    if (problem.message !== undefined) {
      if (!problemsMap.has(problem.message)) {
        problemsMap.set(problem.message, [])
      }
      problemsMap.get(problem.message)?.push(problem)
    }
  }

  for (const message of Array.from(problemsMap.keys()).sort()) {
    output += `${chalk.underline(message)}\n`

    for (const problem of problemsMap.get(message) ?? []) {
      t.cell('Type', problem.type)
      t.cell('Path', problem.filePath?.replace(workingDir, './'))
      t.cell('Key', problem.key)
      t.cell('MessageId', problem.messageId)
      t.newRow()
      total++
    }

    output += t.print()
  }

  // Resets output color, for prevent change on top level
  return total > 0 ? chalk.reset(output) : ''
}
