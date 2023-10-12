import { type Problem } from '@2bad/mimir-validator'
import { json } from '~/formatters/json.js'

describe('json', () => {
  it('should return empty array as JSON when report is empty', () => {
    const report: Problem[] = []
    const expectedJSON = '[]'

    const result = json(report)

    expect(result).toStrictEqual(expectedJSON)
  })

  it('should return JSON representation of the report with proper indentation', () => {
    const report: Problem[] = [
      { type: 'warning', message: 'Invalid input' },
      { type: 'error', message: 'Missing required field' }
    ]
    const expectedJSON = `[
  {
    "type": "warning",
    "message": "Invalid input"
  },
  {
    "type": "error",
    "message": "Missing required field"
  }
]`

    const result = json(report)

    expect(result).toStrictEqual(expectedJSON)
  })
})
