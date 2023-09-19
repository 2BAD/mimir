import { Locale } from '~/types.js'

/**
 * Filters an array of paths to keep only those matching a given locale.
 *
 * @param paths - An array of paths to filter.
 * @param locale - The locale to match against (e.g., 'en', 'fr', 'es').
 * @returns - The filtered array of paths that match the locale.
 */
export const filterPathsByLocale = (paths: string[], locale: Locale): string[] => {
  const regex = new RegExp(`translation\\.${locale}\\.json$`)
  return paths.filter((path) => regex.test(path))
}

/**
 * Extracts the locale from a given path string.
 *
 * @param path - The path to translation file
 * @returns - The extracted locale or null if not found.
 */
export const getLocaleFromPath = (path: string): Locale | null => {
  const regex = /(.*?)translation\.([a-z]{2}(?:_[a-z]{2})?)\.json$/i

  const result = regex.test(path) ? (path.replace(regex, '$2') as Locale) : null
  const locale = Locale.safeParse(result)

  return locale.success ? locale.data : null
}

/**
 * Retrieve locales from an array of paths.
 *
 * @param paths - An array of paths.
 * @returns - Array of unique Locale objects derived from the paths.
 */
export const getLocalesFromPaths = (paths: string[]): Locale[] => {
  const set = new Set<Locale>()

  for (const path of paths) {
    const locale = getLocaleFromPath(path)

    if (locale !== null) {
      set.add(locale)
    }
  }

  return Array.from(set)
}
