import { getTranslationContent } from './fs.ts'
import { type LocaleTranslations, type Translations, type TranslationsCache } from './types.ts'

/**
 *
 * @param translationsPath
 */
export const createCacheStorage = (translationsPath: string): TranslationsCache => {
  let cache: LocaleTranslations

  /**
   *
   * @param locale
   */
  const refresh = (locale: string): void => {
    cache[locale] = getTranslationContent(translationsPath, locale)
  }

  /**
   *
   * @param locale
   */
  const get = (locale: string): Translations | null => {
    if (!cache[locale]) {
      refresh(locale)
    }
    return cache[locale] ?? null
  }

  return { get, refresh }
}
