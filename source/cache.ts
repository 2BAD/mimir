import { filterPathsByLocale } from 'utils.ts'
import { getTranslationContent } from './fs.ts'
import { type Locale, type LocaleTranslations, type Translations, type TranslationsCache } from './types.ts'

/**
 *
 * @param translationsPath
 */
export const createCacheStorage = (translationsPath: string[]): TranslationsCache => {
  let cache: LocaleTranslations

  /**
   *
   * @param locale
   */
  const refresh = (locale: Locale): void => {
    for (const path of filterPathsByLocale(translationsPath, locale)) {
      cache[locale] = getTranslationContent(path)
    }
  }

  /**
   *
   * @param locale
   */
  const get = (locale: Locale): Translations | null => {
    if (!cache[locale]) {
      refresh(locale)
    }
    return cache[locale] ?? null
  }

  return { get, refresh }
}
