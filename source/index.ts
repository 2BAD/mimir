/* eslint-disable jsdoc/require-jsdoc */
import fs from 'fs'
import path from 'path'
import { findTranslationFiles, getAvailableLocales, getTranslationContent, resolveFilePath } from './fs.ts'
import { containsApostrophes, containsHtmlTags, containsPlaceholders, containsPlural } from './rules.ts'
import { type Translations } from './types.ts'

function findTranslationsFolder(searchKey: string, translationPaths: string[]): string {
  for (const filePath of translationPaths) {
    const translations = getTranslationContent(filePath)
    if (translations[searchKey] !== undefined) {
      const directoryPath = path.dirname(filePath)
      return directoryPath
    }
  }

  return ''
}

// this should be something like this:
// export const validateTranslations = (translations: Translations, keys: string[], rules: string[]): ValidationErrors => {

export function getHardKeys(searchPath: string, keys: string[], targetLocale: string): Translations {
  const result: Translations = {}

  const translationPaths = findTranslationFiles(searchPath)

  for (const key of keys) {
    const folderPath = findTranslationsFolder(key, translationPaths)

    const translationFilePath = resolveFilePath(folderPath, targetLocale)
    const targetTranslationContent = getTranslationContent(translationFilePath)

    const targetValue = targetTranslationContent[key]
    const availableLocales = getAvailableLocales(folderPath)

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (folderPath && targetValue) {
      if (
        containsPlural(key) ||
        containsHtmlTags(targetValue) ||
        containsApostrophes(targetValue) ||
        containsPlaceholders(targetValue)
      ) {
        const targetTranslationFilePath = resolveFilePath(folderPath, targetLocale)
        const targetTranslation = getTranslationContent(targetTranslationFilePath)
        result[key] = targetTranslation[key]
      }

      // for (const locale of availableLocales) {
      //   if (locale !== targetLocale) {
      //     const translationContent = getTranslationContent(locale, folderPath);
      //     const translationValue = getTranslationValue(translationContent, key);

      //     console.log(targetValue);

      //     if (isValueLonger(targetValue, translationValue)) {
      //       const targetTranslation = readFromFile(folderPath, targetLocale);
      //       result[key] = targetTranslation[key];
      //     }
      //   }
      // }
    }
  }
  return result
}

function putHardKeysIntoFile(data: Translations): void {
  const resultJSON = JSON.stringify(data, null, 2)
  fs.writeFileSync('output.json', resultJSON, 'utf8')
}

const keys2: string[] = [
  'settings.accountSettings.installedApps.addAppsHTML',
  'settings.accountSettings.installedApps.addedApps',
  'settings.accountSettings.installedApps.allowNonAdminsToAdd',
  'settings.accountSettings.installedApps.alreadyAddedApps',
  'settings.accountSettings.installedApps.appsExtendBoardHTML',
  'settings.accountSettings.installedApps.askYourAdminToAddApps',
  'settings.accountSettings.installedApps.authorizedByTeamMember',
  'settings.accountSettings.installedApps.authorizedByTeamMember_plural',
  'settings.accountSettings.installedApps.getMoreAppControl',
  'settings.accountSettings.installedApps.manageAppsInTeam',
  'settings.accountSettings.installedApps.useAppsToExtendBoard',
  'settings.accountSettings.platformApps.support.rtbSupportApps.askForSupportHTML',
  'settings.accountsSettings.editApps.permissions.scopeDescription.auditlogsRead'
]

const targetLocale = 'pt_BR'
const rootPath = '/Users/oleh.zhmaiev/dev/client'
const hardKeys = getHardKeys(rootPath, keys2, targetLocale)

// eslint-disable-next-line vitest/require-hook
putHardKeysIntoFile(hardKeys)
