import { type Locale } from './types.ts'

/**
 * Filters an array of paths to keep only those matching a given locale.
 *
 * @param paths - An array of paths to filter.
 * @param locale - The locale to match against (e.g., 'en', 'fr', 'es').
 * @returns - The filtered array of paths that match the locale.
 */
export const filterPathsByLocale = (paths: string[], locale: Locale): string[] => {
  const regex = new RegExp(`^translation\\.${locale}\\.json$`)
  return paths.filter((path) => regex.test(path))
}
