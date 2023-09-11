/* eslint-disable jsdoc/require-jsdoc */
export type TranslationsData = Record<string, string>
export type TranslationsCache = Record<string, TranslationsData>

export type Translator = {
  findLocaleByText: (text: string) => string | null
  getText: (locale: string, key: string) => string | null
}

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  const properties = ['errno', 'code', 'syscall', 'path', 'stack']

  return error instanceof Error && properties.every((prop) => prop in error)
}
