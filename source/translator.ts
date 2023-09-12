import { createCache } from './cache.ts'
import { findTranslationFiles, getAvailableLocales } from './fs.ts'
import { type Locale, type Translator } from './types.ts'

/**
 * Initializes a translator object.
 *
 * @param path - The path to the translations directory.
 * @param [locales] - The locales to use for translation. If not provided, the available locales will be retrieved from the translations folder content.
 * @returns The initialized Translator object.
 */
export const initTranslator = (path: string, locales: Locale[] = []): Translator => {
  if (locales.length === 0) {
    locales = getAvailableLocales(path)
  }

  const translationFiles = findTranslationFiles(path, locales)
  const cache = createCache(translationFiles)

  return {
    /**
     * Finds the locale for a given text.
     *
     * @param text - The text to search for in the translations.
     * @returns The locale of the text, or null if not found.
     */
    findLocaleByText: (text: string): string | null => {
      for (const locale of locales) {
        const translations = cacheStorage.get(locale)
        if (translations && Object.values(translations).includes(text)) {
          return locale
        }
      }
      return null
    },
    /**
     * Retrieves the translated text for a given locale and key.
     *
     * @param locale - The locale of the translation.
     * @param key - The key of the translation.
     * @returns The translated text, or null if not found.
     */
    getText: (locale: Locale, key: string): string | null => {
      const translations = cache.get(key, locale)
      return translations?.[locale] ?? null
    }
  }
}
