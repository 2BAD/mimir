import { createCache } from '~/cache.js'
import { findTranslationFiles } from '~/fs.js'
import { type Locale, type TranslationsCacheObject, type Translator } from '~/types.js'
import { getLocalesFromPaths } from '~/utils.js'

/**
 * Initializes a translator object.
 *
 * @param path - The path to the translations directory.
 * @param [locales] - The locales to use for translation. If not provided, the available locales will be retrieved from the translations folder content.
 * @returns The initialized Translator object.
 */
export const initTranslator = (path: string, locales: Locale[] = []): Translator => {
  const translationFiles = findTranslationFiles(path, locales)

  if (locales.length === 0) {
    locales = getLocalesFromPaths(translationFiles)
  }

  const cache = createCache(translationFiles, locales)

  return {
    /**
     * Finds the locale for a given text.
     *
     * @param text - The text to search for in the translations.
     * @returns The locale of the text, or null if not found.
     */
    findLocaleByText: (text: string): string | null => {
      for (const translationMap of cache.values()) {
        for (const [locale, translation] of Object.entries(translationMap)) {
          if (translation.includes(text)) return locale
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
    },

    /**
     * Retrieves translations for a specific key.
     *
     * @param key - The key to lookup translations for.
     * @returns - The translations for the key, or null if not found.
     */
    getTranslations: (key: string): TranslationsCacheObject | null => {
      const translations = cache.get(key)
      return translations
    },

    /**
     * Finds path to translations file for a given key.
     *
     * @param key - The key to search for in the cache.
     * @returns - The path to the translations file if found, or null otherwise.
     */
    findTranslationsFolder(key: string): string | null {
      const translations = cache.get(key)
      return translations ? translations.path : null
    }
  }
}
