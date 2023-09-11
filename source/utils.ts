import { type Locale } from './types.ts'

/**
 *
 * @param paths
 * @param locale
 */
export const filterPathsByLocale = (paths: string[], locale: Locale): string[] => {
  const regex = new RegExp(`^translation\\.${locale}\\.json$`)
  return paths.filter((path) => regex.test(path))
}
