import { filterPathsByLocale, getLocaleFromPath, getLocalesFromPaths } from '~/utils/path.js'

describe('filterPathsByLocale', () => {
  it('should filter paths based on locale', () => {
    const paths = ['translation.en.json', 'translation.fr.json', 'translation.de.json', 'other.file']
    const locale = 'en'

    const result = filterPathsByLocale(paths, locale)

    expect(result).toStrictEqual(['translation.en.json'])
  })

  it('should return an empty array if no matches found', () => {
    const paths = ['file1.json', 'file2.json', 'file3.json']
    const locale = 'fr'

    const result = filterPathsByLocale(paths, locale)

    expect(result).toStrictEqual([])
  })
})

describe('getLocaleFromPath', () => {
  it('should return the locale when given a valid path', () => {
    const path = '/path/to/translation.en.json'
    const result = getLocaleFromPath(path)
    expect(result).toBe('en')
  })

  it('should return the locale with country code when given a valid path', () => {
    const path = '/path/to/translation.pt_BR.json'
    const result = getLocaleFromPath(path)
    expect(result).toBe('pt_BR')
  })

  it('should return null when given an invalid path', () => {
    const path = '/invalid/path/here.txt'
    const result = getLocaleFromPath(path)
    expect(result).toBeNull()
  })
})

describe('getLocalesFromPaths', () => {
  it('should return an array of unique locales from an array of paths', () => {
    const paths = ['/home/translation.en.json', '/about/translation.fr.json', '/contact/translation.es.json']
    const locales = getLocalesFromPaths(paths)
    expect(locales).toStrictEqual(['en', 'fr', 'es'])
  })

  it('should return an empty array when no valid locale is found', () => {
    const paths = ['/translationS.de.json', '/home/index.ts', '/about/translation.ts']
    const locales = getLocalesFromPaths(paths)
    expect(locales).toStrictEqual([])
  })
})
