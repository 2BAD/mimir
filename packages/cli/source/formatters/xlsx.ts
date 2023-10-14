import { type Problem } from '@2bad/mimir-validator'
import { utils, writeFile } from '@e965/xlsx'
import { resolve } from 'node:path'

/**
 * Export given problem data as an XLSX file.
 *
 * @param report - An array of problem objects.
 * @param [filePath] - Optional file path for saving the XLSX file.
 */
export const xlsx = (report: Problem[], filePath = './report.xlsx'): void => {
  const worksheet = utils.json_to_sheet(report)

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Translations')

  writeFile(workbook, resolve(filePath))
}
