import { filterPathsByLocale } from 'utils.ts'
import { readTranslationsFromFile } from './fs.ts'
import { type KeyToTranslationsMap, type Locale, type TranslationsCache } from './types.ts'

/**
 * Creates a cache storage for translations.
 *
 * @param translationFilePaths - An array of paths to translation files.
 * @param cachedLocales - An array of locales to use.
 * @returns - The translations cache object.
 */
export const createCache = (translationFilePaths: string[], cachedLocales: Locale[]): TranslationsCache => {
  const cache = new Map<string, KeyToTranslationsMap>()
  const translationFilePathSet = new Set(translationFilePaths)

  /**
   * Process the paths to translation files and ingest the translations.
   *
   * @param translationPaths - An array of paths to translation files.
   * @param locale - The locale of the translation.
   */
  const process = (translationPaths: string[], locale: Locale): void => {
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
    const data: KeyToTranslationsMap = {
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
  const refresh = (locale: Locale): void => {
    const paths = filterPathsByLocale([...translationFilePathSet.values()], locale)
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
  const get = (key: string, locale?: Locale): KeyToTranslationsMap | null => {
    if (!cache.has(key)) {
      if (locale !== undefined) {
        refresh(locale)
      } else {
        for (const l of cachedLocales) {
          refresh(l)
        }
      }
    }
    return cache.get(key) ?? null
  }

  return { get, refresh, values: cache.values.bind(cache) }
}
