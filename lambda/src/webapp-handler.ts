import { LambdaEnvironment, listS3Badges } from './utils'
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

  api.get('/badges', async (_request, response) => {
    const [s3Badges] = await Promise.all([listS3Badges()])

    response
      .status(200)
      .json({ badges: s3Badges, baseUrl: BASE_URL, stackName: STACK_NAME })
  })

  api.get('*', async (_request, response) => {
    response.download('./frontend/index.html', undefined, {
      headers: {
        'content-disposition': 'inline',
      },
    })
  })

  return await api.run(event, context)
}
