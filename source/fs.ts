// eslint-disable-next-line import/no-named-as-default
import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import { isErrnoException, type Locale, type Translations } from '~/types.js'

// workaround since we cant use named exports from commonjs module
// eslint-disable-next-line import/no-named-as-default-member
const { globSync } = glob

/**
 * Finds translation files based on a search path and optional locales.
 *
 * @param searchPath - The base directory to search in.
 * @param [locales] - Optional array of locales to search for.
 * @returns An array of found translation file paths.
 */
export const findTranslationFiles = (searchPath: string, locales: Locale[] = []): string[] => {
  const variants = locales?.length !== 0 ? `{${locales?.join(',')}}` : '*'
  const pattern = path.join(searchPath, `**/translation.${variants}.json`)
  return globSync(['!**/node_modules/**', pattern])
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
