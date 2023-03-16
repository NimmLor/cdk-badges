/* eslint-disable no-console */
import { CloudFormation } from 'aws-sdk'
import { makeBadge } from 'badge-maker'

const cf = new CloudFormation({ apiVersion: '2010-05-15' })

export const handler = async () => {
  const { STACK_NAME } = process.env

  const stack = await cf
    .describeStacks({
      StackName: STACK_NAME,
    })
    .promise()

  const badge = makeBadge({
    color: '#23175ed1',
    label: STACK_NAME,
    message: stack.Stacks?.[0]?.StackStatus ?? 'unknown',
    style: 'flat-square',
  })

  return {
    body: badge,
    headers: {
      'cache-control': 'max-age=300, private',
      'content-type': 'image/svg+xml; charset=utf-8',
    },
    isBase64Encoded: false,
    statusCode: 200,
  }
}
