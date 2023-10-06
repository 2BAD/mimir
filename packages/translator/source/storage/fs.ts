// eslint-disable-next-line import/no-named-as-default
import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import { ZodError } from 'zod'
import { Translations, isErrnoException, type Locale } from '~/types.js'
const debug = (await import('debug')).default('fs')

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
  const variants = locales.length !== 0 ? (locales.length === 1 ? locales[0] : `{${locales.join(',')}}`) : '*'
  const pattern = path.join(searchPath, `**/translation.${variants}.json`)
  debug(`looking for translation files in '%s' for locales: %o`, pattern, locales)
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
    debug(`reading file '%s'`, filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    translations = Translations.parse(JSON.parse(content))
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
    if (error instanceof ZodError) {
      console.error(`An error occurred while parsing translations: ${error.message}`)
    }
  }

  return translations
}
