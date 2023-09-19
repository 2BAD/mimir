import { findTranslationFiles, readTranslationsFromFile } from '~/storage/fs.js'
import { type Locale, type TranslationsCache, type TranslationsCacheObject } from '~/types.js'
import { filterPathsByLocale, getLocalesFromPaths } from '~/utils/path.js'
const debug = (await import('debug')).default('cache')

/**
 * Creates a cache storage for translations.
 *
 * @param pathToTranslationFolder - A path to the translation folder.
 * @param localesToUse - An array of locales to use.
 * @returns The translations cache object.
 */
export const createCache = (pathToTranslationFolder: string, localesToUse: Locale[]): TranslationsCache => {
  const foundTranslationFiles = findTranslationFiles(pathToTranslationFolder, localesToUse)

  if (localesToUse.length === 0) {
    localesToUse = getLocalesFromPaths(foundTranslationFiles)
  }

  debug(`initializing cache for paths '%o' and locales '%o'`, foundTranslationFiles, localesToUse)
  const cache = new Map<string, TranslationsCacheObject>()
  const translationFilePathSet = new Set(foundTranslationFiles)

  /**
   * Process the paths to translation files and ingest the translations.
   *
   * @param pathsToTranslationFiles - An array of paths to translation files.
   * @param locale - The locale of the translation.
   */
  const process = (pathsToTranslationFiles: string[], locale: Locale): void => {
    debug(`processing '%s' files for locale '%s'`, pathsToTranslationFiles.length, locale)
    for (const path of pathsToTranslationFiles) {
      const translations = readTranslationsFromFile(path)
      for (const [key, value] of Object.entries(translations)) {
        ingest(key, value, locale, path)
      }
      translationFilePathSet.delete(path)
    }
  }

  /**
   * Adds a translation key-value pair to the cache.
   *
   * @param key - The key of the translation.
   * @param value - The translation value.
   * @param locale - The locale of the translation.
   * @param path - The path to the file where the translation is coming from.
   */
  const ingest = (key: string, value: string, locale: Locale, path: string): void => {
    const data: TranslationsCacheObject = {
      path
    }
    data[locale] = value
    cache.set(key, { ...cache.get(key), ...data })
  }

  /**
   * Refreshes the cache for a specific locale.
   *
   * @param [locale] - The locale to refresh.
   */
  const refresh = (locale?: Locale): void => {
    const localesToRefresh: Locale[] = locale ? [locale] : localesToUse

    for (const l of localesToRefresh) {
      debug(`refreshing cache for locale '%s'`, l)
      const filteredPaths = filterPathsByLocale([...translationFilePathSet.values()], l)
      process(filteredPaths, l)
    }
  }

  /**
   * Gets the translations for a specific key from the cache.
   * If the translations are not available in the cache, it refreshes the cache first.
   *
   * @param key - The key to retrieve translations for.
   * @param [locale] - The locale for which to retrieve translations.
   * @returns The translations for the specified locale, or null if not found.
   */
  const get = (key: string, locale?: Locale): TranslationsCacheObject | null => {
    debug(`getting translations for '%s' for locale '%s'`, key, locale)
    if (!cache.has(key)) {
      refresh(locale)
    }
    return cache.get(key) ?? null
  }

  /**
   * Retrieves all the keys in the cache.
   *
   * @returns An array of all the keys in the cache.
   */
  const keys = (): string[] => {
    refresh()
    debug(`getting keys from cache`)
    return [...cache.keys()]
  }

  /**
   * Retrieves all the values in the cache.
   *
   * @returns An array of all the values in the cache.
   */
  const values = (): TranslationsCacheObject[] => {
    refresh()
    debug(`getting values from cache`)
    return [...cache.values()]
  }

  return { get, keys, values }
}
