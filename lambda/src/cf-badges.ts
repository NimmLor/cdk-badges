import { Colors, StatusColors } from './colors'
import type { BadgeProps, StackInfo } from './utils'
import { formatDateTime } from './utils'
import type { StackStatus } from '@aws-sdk/client-cloudformation'
import { makeBadge } from 'badge-maker'

export const CfStatusMappings = {
  CREATE_COMPLETE: {
    color: StatusColors.success.full,
    message: 'Created',
  },
  CREATE_FAILED: {
    color: StatusColors.error.full,
    message: 'Create Failed',
  },
  CREATE_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Creating',
  },
  DELETE_COMPLETE: {
    color: StatusColors.success.full,
    message: 'Deleted',
  },
  DELETE_FAILED: {
    color: StatusColors.error.full,
    message: 'Delete Failed',
  },
  DELETE_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Deleting',
  },
  IMPORT_COMPLETE: {
    color: StatusColors.success.full,
    message: 'Import Complete',
  },
  IMPORT_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Importing',
  },
  IMPORT_ROLLBACK_COMPLETE: {
    color: StatusColors.success.full,
    message: 'Import Rollback Complete',
  },
  IMPORT_ROLLBACK_FAILED: {
    color: StatusColors.error.full,
    message: 'Import Rollback Failed',
  },
  IMPORT_ROLLBACK_IN_PROGRESS: {
    color: StatusColors.warning.light,
    message: 'Import Rollback In Progress',
  },
  REVIEW_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Review In Progress',
  },
  ROLLBACK_COMPLETE: {
    color: StatusColors.warning.full,
    message: 'Rollback Complete',
  },
  ROLLBACK_FAILED: {
    color: StatusColors.error.full,
    message: 'Rollback Failed',
  },
  ROLLBACK_IN_PROGRESS: {
    color: StatusColors.warning.light,
    message: 'Rollback In Progress',
  },
  UPDATE_COMPLETE: {
    color: StatusColors.success.full,
    message: 'Updated',
  },
  UPDATE_COMPLETE_CLEANUP_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Update Cleanup In Progress',
  },
  UPDATE_FAILED: {
    color: StatusColors.error.full,
    message: 'Update Failed',
  },
  UPDATE_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Updating',
  },
  UPDATE_ROLLBACK_COMPLETE: {
    color: StatusColors.warning.full,
    message: 'Update Rollback Complete',
  },
  UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS: {
    color: StatusColors.success.light,
    message: 'Update Rollback Cleanup In Progress',
  },
  UPDATE_ROLLBACK_FAILED: {
    color: StatusColors.error.full,
    message: 'Update Rollback Failed',
  },
  UPDATE_ROLLBACK_IN_PROGRESS: {
    color: StatusColors.warning.light,
    message: 'Update Rollback In Progress',
  },
}

/**
 * Get the appearance of a CloudFormation stack status
 */
const getStackStatusAppearance = (stackStatus?: keyof typeof StackStatus) => {
  if (stackStatus !== undefined && stackStatus in CfStatusMappings) {
    return CfStatusMappings[stackStatus]
  } else {
    return {
      color: StatusColors.unknown.full,
      message: 'unknown',
    }
  }
}

export const getCfLastModifiedBadge = (info: StackInfo, props?: BadgeProps) => {
  const message = formatDateTime(info.updatedAt)
  return makeBadge({
    color:
      message === 'unknown'
        ? Colors.gray[500]
        : props?.color ?? Colors.blue[500],
    label: props?.label ?? 'last modified',
    message,
    style: props?.style ?? 'flat-square',
  })
}

export const getCfStatusBadge = (
  info: Pick<StackInfo, 'status' | 'updatedAt'>,
  props?: BadgeProps,
  includeTimestamp = false
) => {
  const { color, message } = getStackStatusAppearance(info.status)

  return makeBadge({
    color,
    label: props?.label ?? 'CloudFormation',
    message:
      message !== 'unknown' &&
      includeTimestamp === true &&
      info.updatedAt !== undefined
        ? `${message} at ${formatDateTime(info.updatedAt)}`
        : message,
    style: props?.style ?? 'flat-square',
  })
}

export const getCfResourceCountBadge = (count: number, props?: BadgeProps) => {
  let color: string = StatusColors.success.full
  if (count >= 400) color = StatusColors.warning.light
  if (count >= 460) color = StatusColors.error.light
  if (props?.color !== undefined) color = props.color

  return makeBadge({
    color,
    label: props?.label ?? 'CloudFormation',
    message: `${count} Resources`,
    style: props?.style ?? 'flat-square',
  })
}
