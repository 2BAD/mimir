import { z } from 'zod'

export const LocaleValues = {
  English: 'en',
  French: 'fr',
  German: 'de',
  Spanish: 'es',
  Japanese: 'ja_JP',
  BrazilianPortuguese: 'pt_BR'
} as const

export const Locale = z.nativeEnum(LocaleValues)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Locale = z.infer<typeof Locale>

export const Translations = z.record(z.string())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Translations = z.infer<typeof Translations>

export const TranslationsMap = z.record(Locale, z.string())
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TranslationsMap = z.infer<typeof TranslationsMap>

export const TranslationsCacheObject = z.object({
  path: z.string(),
  translations: TranslationsMap
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TranslationsCacheObject = z.infer<typeof TranslationsCacheObject>

export type Translator = {
  getText: (locale: Locale, key: string) => string | null
  getKeys: () => string[]
  getTranslations: (key: string) => TranslationsCacheObject | null
  findLocaleByText: (text: string) => string | null
  findTranslationsFolder: (key: string) => string | null
}

export type TranslationsCache = {
  get: (key: string, locale?: Locale) => TranslationsCacheObject | null
  keys: () => string[]
  values: () => TranslationsCacheObject[]
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  const properties = ['errno', 'code', 'syscall', 'path', 'stack']

  return error instanceof Error && properties.every((prop) => prop in error)
}
