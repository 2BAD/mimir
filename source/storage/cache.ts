import { findTranslationFiles, readTranslationsFromFile } from '~/storage/fs.js'
import { type Locale, type TranslationsCache, type TranslationsCacheObject } from '~/types.js'
import { filterPathsByLocale, getLocalesFromPaths } from '~/utils/path.js'
const debug = (await import('debug')).default('cache')

/**
 * Creates a cache storage for translations.
 *
 * @param cachedPath - A path to translation folder.
 * @param cachedLocales - An array of locales to use.
 * @returns - The translations cache object.
 */
export const createCache = (cachedPath: string, cachedLocales: Locale[]): TranslationsCache => {
  const translationFilePaths = findTranslationFiles(cachedPath, cachedLocales)

  if (cachedLocales.length === 0) {
    cachedLocales = getLocalesFromPaths(translationFilePaths)
  }

  debug(`initializing cache for path '%o' and locales %o`, translationFilePaths, cachedLocales)
  const cache = new Map<string, TranslationsCacheObject>()
  const translationFilePathSet = new Set(translationFilePaths)

  /**
   * Process the paths to translation files and ingest the translations.
   *
   * @param translationPaths - An array of paths to translation files.
   * @param locale - The locale of the translation.
   */
  const process = (translationPaths: string[], locale: Locale): void => {
    debug('processing %s files for locale %s', translationPaths.length, locale)
    for (const path of translationPaths) {
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
   * @param locale - The locale to refresh.
   */
  const refresh = (locale?: Locale): void => {
    const locales: Locale[] = locale ? [locale] : cachedLocales

    for (const l of locales) {
      debug('refreshing cache for locale %s', l)
      const p = filterPathsByLocale([...translationFilePathSet.values()], l)
      process(p, l)
    }
  }

  /**
   * Gets the translations for a specific key from the cache.
   * If the translations are not available in the cache, it refreshes the cache first.
   *
   * @param key - The key to retrieve translations for.
   * @param locale - The locale for which to retrieve translations.
   * @returns - The translations for the specified locale, or null if not found.
   */
  const get = (key: string, locale?: Locale): TranslationsCacheObject | null => {
    debug(`getting translations for '%s' for locale %s`, key, locale)
    if (!cache.has(key)) {
      refresh(locale)
    }
    return cache.get(key) ?? null
  }

  /**
   *
   */
  const keys = (): string[] => {
    refresh()
    debug('getting keys from cache %o', cache)
    return [...cache.keys()]
  }
  /**
   *
   */
  const values = (): TranslationsCacheObject[] => {
    refresh()
    debug('getting values from cache %o', cache)
    return [...cache.values()]
  }

  return { get, refresh, keys, values }
}
