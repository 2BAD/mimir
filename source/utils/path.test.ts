import { getLocalesFromPaths } from '~/utils/path.js'

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
