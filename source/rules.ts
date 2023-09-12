import { readFromFile } from "./fs";

export function containsHtmlTags(value: string): boolean {
  return /<[^>]*>/i.test(value);
}

export function containsApostrophes(value: string): boolean {
  return /'/g.test(value);
}

export function containsPlaceholders(value: string): boolean {
  return /\{\{.*?\}\}/g.test(value);
}

export function containsPlural(key: string): boolean {
  return /plural/i.test(key);
}

export function isValueTheLongest(
  key: string,
  targetLocale: string,
  folderPath: string,
  availableLocales: string[]
): boolean {
  let maxLength = 0;
  const targetTranslationContent = readFromFile(folderPath, targetLocale);
  const targetValue = targetTranslationContent[key];
  const targetLength = targetValue.length;

  for (const locale of availableLocales) {
    if (locale !== targetLocale) {
      const translationContent = readFromFile(folderPath, locale);
      const currentValue = translationContent[key];
      const currentValueLength = currentValue.length;

      if (currentValueLength > maxLength) {
        maxLength = currentValueLength;
      }
    }
  }

  return targetLength > maxLength;
}

export function isProblematic(
  key: string,
  targetLocale: string,
  folderPath: string,
  availableLocales: string[]
): boolean {
  const targetValue = readFromFile(folderPath, targetLocale)[key];

  return (
    containsPlural(key) ||
    containsHtmlTags(targetValue) ||
    containsApostrophes(targetValue) ||
    containsPlaceholders(targetValue) ||
    isValueTheLongest(key, targetLocale, folderPath, availableLocales)
  );
}
