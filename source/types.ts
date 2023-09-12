/* eslint-disable jsdoc/require-jsdoc */
export enum Locale {
  English = 'en',
  French = 'fr',
  German = 'de',
  Japanese = 'jp',
  BrazilianPortuguese = 'pt_BR'
}

export type Translations = Record<string, string>
export type LocaleTranslations = Record<Locale, Translations>

export type KeyToTranslationsMap = {
  [key in Locale]?: string
} & {
  path: string
}

export type Translator = {
  getText: (locale: Locale, key: string) => string | null
  findLocaleByText: (text: string) => string | null
  findTranslationsFolder: (key: string) => string | null
}

export type TranslationsCache = {
  get: (key: string, locale: Locale) => KeyToTranslationsMap | null
  values: () => Iterable<KeyToTranslationsMap>
  refresh: (locale: Locale) => void
}

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  const properties = ['errno', 'code', 'syscall', 'path', 'stack']

  return error instanceof Error && properties.every((prop) => prop in error)
}
