/* eslint-disable jsdoc/require-jsdoc */
import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { getAvailableLocales, readFromFile } from './fs.ts'
import { containsApostrophes, containsHtmlTags, containsPlaceholders, containsPlural } from './rules.ts'
import { type TranslationsData } from './types.ts'

const outputPath = 'output.json'
const rootPath = '/Users/oleh.zhmaiev/dev/client'

function findTranslationsPath(locale: string): string[] {
  return fg.globSync([`${rootPath}/**/translation.${locale}.json`, '!**/node_modules/**'])
}

function findTranslationsFolder(searchKey: string, translationPaths: string[]): string {
  for (const filePath of translationPaths) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const translations: TranslationsData = JSON.parse(fileContent)
    if (translations[searchKey] !== undefined) {
      const directoryPath = path.dirname(filePath)
      return directoryPath
    }
  }

  return ''
}

function getTranslationContent(locale: string, folderPath: string) {
  return readFromFile(folderPath, locale)
}

function getTranslationValue(translationContent: TranslationsData, key: string): string {
  return translationContent[key]
}

// TODO Implement function 'isValueTheLongest"
function isValueLonger(targetValue: string, value: string): boolean {
  console.log(targetValue.length, 'VS', value.length)
  return targetValue.length > value.length
}

export function getHardKeys(keys: string[], targetLocale: string): TranslationsData {
  const result: TranslationsData = {}

  const translationPaths = findTranslationsPath(targetLocale)

  for (const key of keys) {
    const folderPath = findTranslationsFolder(key, translationPaths)

    const targetTranslationContent = getTranslationContent(targetLocale, folderPath)
    const targetValue = getTranslationValue(targetTranslationContent, key)
    const availableLocales = getAvailableLocales(folderPath)

    if (folderPath && targetValue) {
      if (
        containsPlural(key) ||
        containsHtmlTags(targetValue) ||
        containsApostrophes(targetValue) ||
        containsPlaceholders(targetValue)
      ) {
        const targetTranslation = readFromFile(folderPath, targetLocale)
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

function putHardKeysIntoFile(data: TranslationsData): void {
  const resultJSON = JSON.stringify(data, null, 2)
  fs.writeFileSync(outputPath, resultJSON, 'utf8')
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
const hardKeys = getHardKeys(keys2, targetLocale)

putHardKeysIntoFile(hardKeys)
