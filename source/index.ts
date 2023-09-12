import {
  findTranslationsFolder,
  findTranslationsPaths,
  getAvailableLocales,
  readFromFile,
  writeIntoJson,
  writeIntoXLSX
} from './fs'
import { keys } from './keys'
import { isProblematic } from './rules'
import { type TranslationsData } from './types'

const rootPath = '/Users/oleh.zhmaiev/dev/client'

/**
 *
 * @param keys
 * @param targetLocale
 */
export function getProblematicKeys(keys: string[], targetLocale: string): TranslationsData {
  const result: TranslationsData = {}

  const translationPaths = findTranslationsPaths(rootPath, targetLocale)

  for (const key of keys) {
    const folderPath = findTranslationsFolder(key, translationPaths)

    if (folderPath) {
      const availableLocales = getAvailableLocales(folderPath)

      if (isProblematic(key, targetLocale, folderPath, availableLocales)) {
        const targetTranslation = readFromFile(folderPath, targetLocale)
        result[key] = targetTranslation[key]
      }
    }
  }

  return result
}

const targetLocale = 'pt_BR'
const outputPath = 'output'
const hardKeys = getProblematicKeys(keys, targetLocale)

writeIntoJson(hardKeys, outputPath)
writeIntoXLSX(hardKeys, outputPath)
