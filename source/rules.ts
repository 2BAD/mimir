/* eslint-disable jsdoc/require-jsdoc */
// CHECKS
export function containsHtmlTags(value: string): boolean {
  return /<[^>]*>/i.test(value)
}
export function containsApostrophes(value: string): boolean {
  return /'/g.test(value)
}
export function containsPlaceholders(value: string): boolean {
  return /\{\{.*?\}\}/g.test(value)
}
export function containsPlural(key: string): boolean {
  return /plural/i.test(key)
}
// TODO Implement function 'isValueTheLongest"
export function isValueLonger(targetValue: string, value: string): boolean {
  console.log(targetValue.length, 'VS', value.length)
  return targetValue.length > value.length
}
