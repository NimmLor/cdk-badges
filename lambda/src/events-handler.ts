/* eslint-disable no-console */

import { getCfStatusBadge } from './cf-badges'
import { getCodePipelineStatusBadge } from './codepipeline-badges'
import { getBadgeKeys } from './filenames'
import { updateStackResourceCountBadge } from './trigger-handler'
import { LambdaEnvironment, writeBadgeToS3 } from './utils'
import type { StackStatus } from '@aws-sdk/client-cloudformation'
import type { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda'
import type { Format } from 'badge-maker'
import { promises } from 'dns'

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

const isCodePipelineStatusEvent = (
  event: UnknownEvent
): event is EventBridgeEvent<
  'CodePipeline Pipeline Execution State Change',
  {
    'execution-id': string
    pipeline: string
    state: 'FAILED' | 'STARTED' | 'STOPPED' | 'SUCCEEDED'
    version: number | string
  }
> => event['detail-type'] === 'CodePipeline Pipeline Execution State Change'

// const isCodePipelineStageEvent = (
//   event: UnknownEvent
// ): event is EventBridgeEvent<
//   'CodePipeline Pipeline Execution State Change',
//   {
//     detail: {
//       'execution-id': string
//       pipeline: string
//       stage: string
//       state: 'FAILED' | 'STARTED' | 'STOPPED' | 'SUCCEEDED'
//       version: 1
//     }
//   }
// > => event['detail-type'] === 'CodePipeline Pipeline Execution State Change'

export const eventsHandler: EventBridgeHandler<string, unknown, void> = async (
  event
) => {
  const badges: Array<{
    filekey: string
    label: string
    style: Format['style'] & string
    svg: string
  }> = []
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
          filekey: getBadgeKeys(stackName, style).cf.status,
          label: `${stackName} Generic Stack Status`,
          style,
          svg: getCfStatusBadge({ status, updatedAt }, { style }),
        },
        {
          filekey: getBadgeKeys(stackName, style).cf.namedStatus,
          label: `${stackName} Stack Status`,
          style,
          svg: getCfStatusBadge(
            { status, updatedAt },
            { label: `${stackName} Stack`, style }
          ),
        },
        {
          filekey: getBadgeKeys(stackName, style).cf.statusDetailed,
          label: `${stackName} Detailed Generic Stack Status`,
          style,
          svg: getCfStatusBadge({ status, updatedAt }, { style }, true),
        },
        {
          filekey: getBadgeKeys(stackName, style).cf.namedStatusDetailed,
          label: `${stackName} Detailed Stack Status`,
          style,
          svg: getCfStatusBadge(
            { status, updatedAt },
            { label: `${stackName} Stack`, style },
            true
          ),
        }
      )
    }
  } else if (isCodePipelineStatusEvent(event)) {
    const { state, pipeline } = event.detail
    console.log('CodePipeline event:', event.detail)
    for (const style of LambdaEnvironment.BADGE_STYLES) {
      badges.push(
        {
          filekey: getBadgeKeys(pipeline, style).cf.status,
          label: `${pipeline} Status`,
          style,
          svg: getCodePipelineStatusBadge({ state }, { style }, true),
        },
        {
          filekey: getBadgeKeys(pipeline, style).cf.status,
          label: `${pipeline} Generic Status`,
          style,
          svg: getCodePipelineStatusBadge({ state }, { style }),
        }
      )
    }
  }

  promises.push(
    ...badges.map(
      async ({ filekey, svg, label, style }) =>
        await writeBadgeToS3({ filekey, label, style, svg })
    )
  )

  await Promise.all(promises)

  return
}
