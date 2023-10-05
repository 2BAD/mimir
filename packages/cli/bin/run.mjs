#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable vitest/require-hook */

;(async () => {
  const oclif = await import('@oclif/core')
  await oclif.execute({ dir: import.meta.url })
})()
