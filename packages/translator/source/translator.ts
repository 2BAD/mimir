import { createCache } from '~/storage/cache.js'
import { type Locale, type TranslationsMap, type Translator } from '~/types.js'
const debug = (await import('debug')).default('translator')

/**
 * Initializes a translator object.
 *
 * @param path - The path to the translations directory.
 * @param [locales] - The locales to use for translation. If not provided, the available locales will be retrieved from the translations folder content.
 * @returns The initialized Translator object.
 */
export const initTranslator = (path: string, locales: Locale[] = []): Translator => {
  const cache = createCache(path, locales)

  /**
   * Finds the locale for a given text.
   *
   * @param text - The text to search for in the translations.
   * @returns The locale of the text, or null if not found.
   */
  const findLocaleByText = (text: string): string | null => {
    for (const e of cache.values()) {
      for (const [locale, translation] of Object.entries(e.translations)) {
        if (translation.includes(text)) return locale
      }
    }
    return null
  }

  /**
   * Retrieves the translated text for a given locale and key.
   *
   * @param locale - The locale of the translation.
   * @param key - The key of the translation.
   * @returns The translated text, or null if not found.
   */
  const getText = (locale: Locale, key: string): string | null => {
    debug('requesting translation text for key: %o locale: %o', key, locale)
    const e = cache.get(key, locale)
    return e?.translations[locale] ?? null
  }

  /**
   * Retrieves translations for a specific key.
   *
   * @param key - The key to lookup translations for.
   * @returns The translations for the key, or null if not found.
   */
  const getTranslations = (key: string): TranslationsMap | null => {
    debug('requesting translations for key: %o', key)
    const e = cache.get(key)
    return e?.translations ?? null
  }

  /**
   * Retrieves the keys in the cache.
   *
   * @returns The array of keys in the cache.
   */
  const getKeys = (): string[] => {
    debug('requesting all keys from cache')
    const keys = [...cache.keys()]
    return keys
  }

  /**
   * Finds the path to the translations file for a given key.
   *
   * @param key - The key to search for in the cache.
   * @returns The path to the translations file if found, or null otherwise.
   */
  const findTranslationsFolder = (key: string): string | null => {
    debug('requesting translation file path containing key: %o', key)
    const e = cache.get(key)
    return e ? e.path : null
  }

  return { getText, getKeys, getTranslations, findLocaleByText, findTranslationsFolder }
}
