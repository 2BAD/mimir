// import { readFromFile } from "./fs";

import { type Locale, type TranslationsCacheObject } from './types.js'

/**
 * Checks if the translations object contains identical translations.
 *
 * @param translations - The translations object to check.
 * @returns - Returns either `false` if no identical translations are found, or an object with the path and message of the locales with identical translations.
 */
export const containsIdenticalTranslation = (translations: TranslationsCacheObject): false | Record<string, string> => {
  const values = Object.values(translations)
  const fm = values.reduce((m, v) => {
    if (m.has(v)) {
      m.set(v, m.get(v) + 1)
    } else {
      m.set(v, 1)
    }
    return m
  }, new Map())

  const locales: string[] = Object.entries(translations)
    .filter(([_, t]) => fm.get(t) > 1)
    .map((e) => e[0])

  if (locales.length > 0) {
    return {
      path: translations.path,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      translation: translations[locales[0] as Locale] as string,
      message: `Following locales have the same translation: ${locales.toString()}`
    }
  } else {
    return false
  }
}

// export function containsHtmlTags(value: string): boolean {
//   return /<[^>]*>/i.test(value);
// }

// export function containsApostrophes(value: string): boolean {
//   return /'/g.test(value);
// }

// export function containsPlaceholders(value: string): boolean {
//   return /\{\{.*?\}\}/g.test(value);
// }

// export function containsPlural(key: string): boolean {
//   return /plural/i.test(key);
// }

// export function isValueTheLongest(
//   key: string,
//   targetLocale: string,
//   folderPath: string,
//   availableLocales: string[]
// ): boolean {
//   let maxLength = 0;
//   const targetTranslationContent = readFromFile(folderPath, targetLocale);
//   const targetValue = targetTranslationContent[key];
//   const targetLength = targetValue.length;

//   for (const locale of availableLocales) {
//     if (locale !== targetLocale) {
//       const translationContent = readFromFile(folderPath, locale);
//       const currentValue = translationContent[key];
//       const currentValueLength = currentValue.length;

//       if (currentValueLength > maxLength) {
//         maxLength = currentValueLength;
//       }
//     }
//   }

//   return targetLength > maxLength;
// }

// export function isProblematic(
//   key: string,
//   targetLocale: string,
//   folderPath: string,
//   availableLocales: string[]
// ): boolean {
//   const targetValue = readFromFile(folderPath, targetLocale)[key];

//   return (
//     containsPlural(key) ||
//     containsHtmlTags(targetValue) ||
//     containsApostrophes(targetValue) ||
//     containsPlaceholders(targetValue) ||
//     isValueTheLongest(key, targetLocale, folderPath, availableLocales)
//   );
// }
