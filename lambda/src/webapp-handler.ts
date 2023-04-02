/* eslint-disable no-console */

import { LambdaEnvironment, listS3Badges } from './utils'
import { render } from './webapp/entry'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import type { Request, Response } from 'lambda-api'
import createApi from 'lambda-api'

const { STACK_NAME, BASE_URL, CACHE_CONTROL } = LambdaEnvironment

export const functionUrlHandler: APIGatewayProxyHandlerV2<unknown> = async (
  event,
  context
) => {
  const api = createApi()

  api.use((_request: Request, response: Response, next) => {
    response.cors({ headers: '*', methods: 'GET' })
    response.header('Cache-Control', CACHE_CONTROL)
    next()
  })

  api.get('/', async (_request, response) => {
    const [s3Badges] = await Promise.all([listS3Badges()])

    const html = render(`
<div class="max-w-3xl mx-auto">
  <div class="border border-gray-700 rounded-lg">
    <h2 class="w-full border-b border-gray-700 p-2 lg:p-4 font-semibold text-lg">${STACK_NAME}</h2>
    <div class="grid lg:grid-cols-2 gap-x-6 gap-y-4 p-4 lg:p-8">
${s3Badges
  .map(
    ({ url }) => `<div>
<img src="${url}" class="block" />
  <button type="button" class="py-1 mr-3 text-sm text-center text-sky-500 hover:text-sky-700 focus:outline-none" onclick="navigator.clipboard.writeText('${url}')">Copy URL</button>
  <button type="button" class="py-1 mr-3 text-sm text-center text-sky-500 hover:text-sky-700 focus:outline-none" onclick="navigator.clipboard.writeText('![](${url})')">Copy Markdown</button>
</div>`
  )
  .join('\n')}
    </div>
  </div>
  <div class="mt-4 text-right">
    powered by
    <a href="https://github.com/NimmLor/cdk-badges" class="link" target="_blank" >cdk-badges</a>
  </div>
</div>
`)

    response.status(200).html(html)
  })

  api.get('/badges', async (_request, response) => {
    const [s3Badges] = await Promise.all([listS3Badges()])

    response
      .status(200)
      .json({ badges: s3Badges, baseUrl: BASE_URL, stackName: STACK_NAME })
  })

  return await api.run(event, context)
}
