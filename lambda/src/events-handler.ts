/* eslint-disable no-console */

import { getCfStatusBadge } from './cf-badges'
import { getCfBadgeKeys } from './filenames'
import { updateStackResourceCountBadge } from './trigger-handler'
import { LambdaEnvironment, writeBadgeToS3 } from './utils'
import type { StackStatus } from '@aws-sdk/client-cloudformation'
import type { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda'

type UnknownEvent = EventBridgeEvent<string, unknown>

const isCfStackEvent = (
  event: UnknownEvent
): event is EventBridgeEvent<
  'CloudFormation Stack Status Change',
  {
    'stack-id': string
    'status-details': {
      status: StackStatus
      'status-reason': string
    }
  }
> => event['detail-type'] === 'CloudFormation Stack Status Change'

export const eventsHandler: EventBridgeHandler<string, unknown, void> = async (
  event
) => {
  const badges: Array<{ filekey: string; svg: string }> = []
  const promises: Array<Promise<unknown>> = []

  console.log('Received event:', JSON.stringify(event, null, 2))

  if (isCfStackEvent(event)) {
    // update resource count badge
    promises.push(updateStackResourceCountBadge())

    const status = event.detail['status-details'].status
    const updatedAt = new Date(event.time)
    const stackName =
      event.detail['stack-id'].split(':stack/')[1].split('/')[0] ?? 'default'

    for (const style of LambdaEnvironment.BADGE_STYLES) {
      badges.push(
        {
          filekey: getCfBadgeKeys(stackName, style).status,
          svg: getCfStatusBadge({ status, updatedAt }, { style }),
        },
        {
          filekey: getCfBadgeKeys(stackName, style).namedStatus,
          svg: getCfStatusBadge(
            { status, updatedAt },
            { label: `${stackName} Stack`, style }
          ),
        },
        {
          filekey: getCfBadgeKeys(stackName, style).statusDetailed,
          svg: getCfStatusBadge({ status, updatedAt }, { style }, true),
        },
        {
          filekey: getCfBadgeKeys(stackName, style).namedStatusDetailed,
          svg: getCfStatusBadge(
            { status, updatedAt },
            { label: `${stackName} Stack`, style },
            true
          ),
        }
      )
    }
  }

  promises.push(
    ...badges.map(
      async ({ filekey, svg }) => await writeBadgeToS3({ filekey, svg })
    )
  )

  await Promise.all(promises)

  return
}