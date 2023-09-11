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
