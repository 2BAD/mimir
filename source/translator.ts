import { createCacheStorage } from './cache'
import { getAvailableLocales } from './fs'
import { type Translator } from './types'

/**
 * Initializes a translator object.
 *
 * @param translationsPath - The path to the translations directory.
 * @param [locales] - The locales to use for translation. If not provided, the available locales will be retrieved from the translations folder content.
 * @returns The initialized Translator object.
 */
export const initTranslator = (translationsPath: string, locales: string[] = []): Translator => {
  if (locales.length === 0) {
    // eslint-disable-next-line no-param-reassign
    locales = getAvailableLocales(translationsPath)
  }

  const cacheStorage = createCacheStorage(translationsPath)

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
    getText: (locale: string, key: string): string | null => {
      const translations = cacheStorage.get(locale)
      return translations?.[key] ?? null
    }
  }
}
