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

export type Translator = {
  findLocaleByText: (text: string) => string | null
  getText: (locale: string, key: string) => string | null
}

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  const properties = ['errno', 'code', 'syscall', 'path', 'stack']

  return error instanceof Error && properties.every((prop) => prop in error)
}
