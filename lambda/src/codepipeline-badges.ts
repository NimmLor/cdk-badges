import { StatusColors } from './colors'
import type { BadgeProps } from './utils'
import { formatDateTime } from './utils'
import { makeBadge } from 'badge-maker'

type CodePipelineState = 'FAILED' | 'STARTED' | 'STOPPED' | 'SUCCEEDED'

const mapCodePipelineStateToReadable = (
  state: CodePipelineState
): {
  color: string
  message: string
} => {
  switch (state) {
    case 'FAILED':
      return { color: StatusColors.error.full, message: 'Failed' }
    case 'STARTED':
      return { color: StatusColors.success.light, message: 'Started' }
    case 'STOPPED':
      return { color: StatusColors.warning.full, message: 'Stopped' }
    case 'SUCCEEDED':
      return { color: StatusColors.success.full, message: 'Succeeded' }
    default:
      return { color: StatusColors.error.full, message: 'Unknown' }
  }
}

export const getCodePipelineStatusBadge = (
  info: {
    stage?: string
    state: CodePipelineState
    timestamp?: string
  },
  props?: BadgeProps,
  includeTimestamp = false
) => {
  const { message, color } = mapCodePipelineStateToReadable(info.state)

  const timestamp = info.timestamp ?? new Date().toISOString()

  return makeBadge({
    color,
    label: props?.label ?? info.stage ?? 'Pipeline',
    message:
      includeTimestamp === true
        ? `${message} at ${formatDateTime(timestamp)}`
        : message,
    style: props?.style ?? 'flat-square',
  })
}
