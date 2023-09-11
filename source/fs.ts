import { globSync } from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import { isErrnoException, type TranslationsData } from './types.ts'

/**
 * Finds translation files in the specified path.
 *
 * @param searchPath - The path to search for translation files.
 * @returns - An array of translation file paths.
 */
export const findTranslationFiles = (searchPath: string): string[] => {
  return globSync(['!**/node_modules/**', path.join(searchPath, '**/translation.*.json')])
}

/**
 * Resolves the path to the translations folder based on the provided path.
 *
 * @param translationsPath - The translations path.
 * @returns The resolved folder path.
 */
export const resolveFolderPath = (translationsPath: string): string => {
  // Check if running inside Jenkins runners or local machine
  // eslint-disable-next-line dot-notation
  const pwd = process.env['WORKSPACE'] ?? process.env['PWD'] ?? ''
  return path.resolve(pwd, translationsPath)
}

/**
 * Resolves the path for translations file based on the given path and locale.
 *
 * @param translationsPath - The base path for translations.
 * @param locale - The locale to be used for translations.
 * @returns The resolved path for the translation file.
 */
export const resolveFilePath = (translationsPath: string, locale: string): string => {
  const FILE_NAME = `translation.${locale}.json`
  const folderPath = resolveFolderPath(translationsPath)
  return path.resolve(folderPath, FILE_NAME)
}

/**
 * Reads translations from a file at the given file path.
 *
 * @param translationsPath - The path to the translations file.
 * @param locale - The locale of the translations.
 * @returns The translations data.
 */
export const readFromFile = (translationsPath: string, locale: string): TranslationsData => {
  let translations: TranslationsData = {}
  const filePath = resolveFilePath(translationsPath, locale)

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    translations = JSON.parse(content) as TranslationsData
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

/**
 * Retrieves the available locales based on files in translations directory.
 *
 * @param translationsPath - The path to the translations directory.
 * @returns An array of available locales.
 */
export const getAvailableLocales = (translationsPath: string): string[] => {
  let locales: string[] = []
  const folderPath = resolveFolderPath(translationsPath)

  try {
    const files = fs.readdirSync(folderPath)
    locales = files
      .filter((file) => /^translation\.[^.]+\.json$/.test(file))
      .map((file) => file.replace(/^translation\.|\.(json)$/g, ''))
  } catch (error) {
    if (isErrnoException(error)) {
      switch (error.code) {
        case 'ENOENT':
          console.error(`The directory doesn't exist at path: ${folderPath}.`)
          break
        case 'EACCES':
          console.error(`Permission denied while accessing directory: ${folderPath}.`)
          break
        case 'ENOTDIR':
          console.error(`The specified path is not a directory: ${folderPath}.`)
          break
        default:
          console.error(`An unknown error occurred while reading file: ${error.message}`)
      }
    }
  }

  return locales
}
