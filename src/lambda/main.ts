/* eslint-disable no-console */
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from '@aws-sdk/client-cloudformation'
import { makeBadge } from 'badge-maker'

const cf = new CloudFormationClient({})

export const lambdaHandler = async () => {
  const { STACK_NAME } = process.env

  const stack = await cf.send(
    new DescribeStacksCommand({ StackName: STACK_NAME })
  )

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
