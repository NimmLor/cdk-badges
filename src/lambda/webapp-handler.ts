/* eslint-disable no-console */

import {
  getCfLastModifiedBadge,
  getCfResourceCountBadge,
  getCfStatusBadge,
} from './cf-badges'
import { StatusColors } from './colors'
import { getCfStackInfo, getCfStackResources } from './utils'
import { render } from './webapp/entry'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import createApi from 'lambda-api'

const { STACK_NAME } = process.env

if (STACK_NAME === undefined || STACK_NAME === '')
  throw new Error('STACK_NAME is not defined.')

export const functionUrlHandler: APIGatewayProxyHandlerV2<unknown> = async (
  event,
  context
) => {
  const api = createApi()

  api.get('/', async (_request, response) => {
    const [info, resources] = await Promise.all([
      getCfStackInfo(STACK_NAME),
      getCfStackResources(STACK_NAME),
    ])

    const badges = [
      getCfLastModifiedBadge(info, {}),
      getCfStatusBadge(info, {}),
      getCfStatusBadge(info, {}, true),
      getCfResourceCountBadge(resources.length, {}),
      getCfResourceCountBadge(0, {}),
      getCfResourceCountBadge(100, {}),
      getCfResourceCountBadge(200, {}),
      getCfResourceCountBadge(300, {}),
      getCfResourceCountBadge(420, {}),
      getCfResourceCountBadge(490, {}),
    ]

    const html = render(`<div class="grid lg:grid-cols-3">
${badges.map((badge) => `<div class="p-4">${badge}</div>`).join('\n')}
</div>
`)

    response.status(200).html(html)
  })

  return await api.run(event, context)
}
