import { type Problem } from '~/rules/utils/types.js'

export type Validator = {
  run: (keys?: string[], keysToIgnore?: string[]) => Problem[]
}
