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

export type Translations = Record<string, string>
export type TranslationsMap = {
  [key in Locale]?: string
}

export type TranslationsCacheObject = TranslationsMap & {
  path: string
}

export type Translator = {
  getText: (locale: Locale, key: string) => string | null
  getTranslations: (key: string) => TranslationsCacheObject | null
  findLocaleByText: (text: string) => string | null
  findTranslationsFolder: (key: string) => string | null
}

export type TranslationsCache = {
  get: (key: string, locale?: Locale) => TranslationsCacheObject | null
  values: () => Iterable<TranslationsCacheObject>
  refresh: (locale: Locale) => void
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  const properties = ['errno', 'code', 'syscall', 'path', 'stack']

  return error instanceof Error && properties.every((prop) => prop in error)
}
