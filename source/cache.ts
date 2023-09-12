import { filterPathsByLocale } from 'utils.ts'
import { getTranslationContent } from './fs.ts'
import { type KeyToTranslationsMap, type Locale, type TranslationsCache } from './types.ts'

/**
 * Creates a cache storage for translations.
 *
 * @param translationsPath - An array of paths to translation files.
 * @returns - The translations cache object.
 */
export const createCache = (translationsPath: string[]): TranslationsCache => {
  const cache = new Map<string, KeyToTranslationsMap>()
  const pathSet = new Set(translationsPath)

  /**
   * Process the paths to translation files and ingest the translations.
   *
   * @param paths - An array of paths to translation files.
   * @param locale - The locale of the translation.
   */
  const process = (paths: string[], locale: Locale): void => {
    for (const path of paths) {
      const translations = getTranslationContent(path)
      for (const [key, value] of Object.entries(translations)) {
        ingest(key, value, locale, path)
      }
      pathSet.delete(path)
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
    const data: KeyToTranslationsMap = {
      // this should be appended instead
      paths: [path]
    }
    data[locale] = value
    cache.set(key, Object.assign({}, cache.get(key), data))
  }

  /**
   * Refreshes the cache for a specific locale.
   *
   * @param locale - The locale to refresh.
   */
  const refresh = (locale: Locale): void => {
    const paths = filterPathsByLocale([...pathSet.values()], locale)
    process(paths, locale)
  }

  /**
   * Gets the translations for a specific key from the cache.
   * If the translations are not available in the cache, it refreshes the cache first.
   *
   * @param key - The key to retrieve translations for.
   * @param locale - The locale for which to retrieve translations.
   * @returns - The translations for the specified locale, or null if not found.
   */
  const get = (key: string, locale: Locale): KeyToTranslationsMap | null => {
    if (cache.has(key) === undefined) {
      refresh(locale)
    }
    return cache.get(key) ?? null
  }

  return { get, refresh }
}
