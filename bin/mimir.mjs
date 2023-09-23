#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable vitest/require-hook */
/* eslint-disable n/shebang */

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const cliModule = path.resolve(dirname, '../build/cli.js')

const cli = await import(cliModule)
cli.run(process.argv)
