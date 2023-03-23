/* eslint-disable no-console */

import { getCfStatusBadge } from './cf-badges'
import { getCfBadgeKeys } from './filenames'
import { writeBadgeToS3 } from './utils'
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

  if (isCfStackEvent(event)) {
    const status = event.detail['status-details'].status
    const updatedAt = new Date(event.time)
    const stackName =
      event.detail['stack-id'].split(':stack/')[1].split('/')[0] ?? 'default'

    badges.push(
      {
        filekey: getCfBadgeKeys(stackName).status,
        svg: getCfStatusBadge({ status, updatedAt }),
      },
      {
        filekey: getCfBadgeKeys(stackName).statusDetailed,
        svg: getCfStatusBadge({ status, updatedAt }, {}, true),
      }
    )
  }

  await Promise.all(
    badges.map(
      async ({ filekey, svg }) => await writeBadgeToS3({ filekey, svg })
    )
  )

  return
}
