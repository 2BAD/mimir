import { globSync } from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import { isErrnoException, type Locale, type Translations } from './types.ts'

/**
 * Finds translation files based on a search path and optional locales.
 *
 * @param searchPath - The base directory to search in.
 * @param [locales] - Optional array of locales to search for.
 * @returns An array of found translation file paths.
 */
export const findTranslationFiles = (searchPath: string, locales: Locale[] = []): string[] => {
  const pattern = locales?.length !== 0 ? `{${locales?.join(',')}}` : '*'
  return globSync(['!**/node_modules/**', path.join(searchPath, `**/translation.${pattern}.json`)])
}

/**
 * Reads translations from a file at the given file path.
 *
 * @param filePath - The path to the translations file.
 * @returns The translations data.
 */
export const readTranslationsFromFile = (filePath: string): Translations => {
  let translations: Translations = {}

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    translations = JSON.parse(content) as Translations
  } catch (error) {
    if (isErrnoException(error)) {
      switch (error.code) {
        case 'ENOENT':
          console.error(`Translation file not found at path: ${filePath}.`)
          break
        case 'EACCES':
          console.error(`Permission denied while reading file: ${filePath}.`)
          break
        default:
          console.error(`An unknown error occurred while reading file: ${error.message}`)
      }
    }
  }
  return translations
}
