/* eslint-disable no-console */

import {
  CfStatusMappings,
  getCfLastModifiedBadge,
  getCfStackInfo,
  getCfStatusBadge,
} from './cf-badges'
import { allColors } from './colors'
import type { Handler } from 'aws-lambda'

export const lambdaHandler: Handler = async (event) => {
  const { STACK_NAME } = process.env

  console.log('STACK_NAME', event)

  if (STACK_NAME === undefined || STACK_NAME === '')
    throw new Error('STACK_NAME is not defined.')

  const info = await getCfStackInfo(STACK_NAME)

  const html = `
<html>
<head>
  <title>CDK Badges</title>
</head>
<body>
${getCfLastModifiedBadge(info)}
${allColors
  .map(
    (color, index) =>
      `<div style="margin-bottom:4px;margin-right:3px;">${getCfLastModifiedBadge(
        info,
        {
          color,
        }
      )}${getCfStatusBadge(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { ...info, status: Object.keys(CfStatusMappings)[index] as any },
        {
          color,
        }
      )}${getCfStatusBadge(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { ...info, status: Object.keys(CfStatusMappings)[index] as any },
        {
          color,
        },
        true
      )}</div>`
  )
  .join('\n')}
${allColors
  .map(
    (color) =>
      `${getCfLastModifiedBadge(info, { color, style: 'for-the-badge' })}`
  )
  .join('\n')}
${allColors
  .map((color) => `${getCfLastModifiedBadge({}, { color })}`)
  .join('\n')}
</body>
</html>`

  return {
    body: html,
    headers: {
      'cache-control': 'max-age=300, private',
      // 'content-type': 'image/svg+xml; charset=utf-8',
      'content-type': 'text/html; charset=utf-8',
    },
    isBase64Encoded: false,
    statusCode: 200,
  }
}
