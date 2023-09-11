import { filterPathsByLocale } from 'utils.ts'
import { getTranslationContent } from './fs.ts'
import { type Locale, type LocaleTranslations, type Translations, type TranslationsCache } from './types.ts'

/**
 * Creates a cache storage for translations.
 *
 * @param translationsPath - An array of paths to translation files.
 * @returns - The translations cache object.
 */
export const createCacheStorage = (translationsPath: string[]): TranslationsCache => {
  let cache: LocaleTranslations

  /**
   * Refreshes the cache for a specific locale.
   *
   * @param locale - The locale to refresh.
   */
  const refresh = (locale: Locale): void => {
    for (const path of filterPathsByLocale(translationsPath, locale)) {
      cache[locale] = getTranslationContent(path)
    }
  }

  /**
   * Gets the translations for a specific locale from the cache.
   * If the translations are not available in the cache, it refreshes the cache first.
   *
   * @param locale - The locale to retrieve translations for.
   * @returns - The translations for the specified locale, or null if not found.
   */
  const get = (locale: Locale): Translations | null => {
    if (cache[locale] === undefined) {
      refresh(locale)
    }
    return cache[locale] ?? null
  }

  return { get, refresh }
}
