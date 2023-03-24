/* eslint-disable no-console */
import type { Stack, StackStatus } from '@aws-sdk/client-cloudformation'
import {
  CloudFormationClient,
  DescribeStackResourcesCommand,
  DescribeStacksCommand,
} from '@aws-sdk/client-cloudformation'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export type StackInfo = Partial<{
  createdAt: Stack['CreationTime']
  driftInfo: Stack['DriftInformation']
  found: boolean
  outputs: Stack['Outputs']
  stackName: string
  status: keyof typeof StackStatus
  statusReason: Stack['StackStatusReason']
  updatedAt: Stack['LastUpdatedTime']
}>

const cf = new CloudFormationClient({})

const BUCKET_NAME = process.env.BUCKET_NAME
const { CACHE_CONTROL, HOUR12, LOCALE, TIMEZONE } = process.env

if (BUCKET_NAME === undefined || BUCKET_NAME === '')
  throw new Error('BUCKET_NAME is not defined.')

if (CACHE_CONTROL === undefined || CACHE_CONTROL === '')
  throw new Error('CACHE_CONTROL is not defined.')

export const getLocalization = () => {
  return {
    hour12: HOUR12 === 'true',
    locale: LOCALE,
    timezone: TIMEZONE,
  }
}

const s3 = new S3Client({})

/**
 * Write a badge to S3
 */
export const writeBadgeToS3 = async ({
  filekey,
  svg,
}: {
  filekey: string
  svg: string
}) => {
  console.log(`Creating badge: ${filekey}`)
  await s3.send(
    new PutObjectCommand({
      Body: svg,
      Bucket: BUCKET_NAME,
      CacheControl: CACHE_CONTROL,
      ContentDisposition: 'inline',
      ContentType: 'image/svg+xml',
      Key: filekey,
      Tagging: new URLSearchParams({
        generatedAt: new Date().toISOString(),
        source: 'cdk-badges',
      }).toString(),
    })
  )
}

export const getCfStackInfo = async (stackName: string): Promise<StackInfo> => {
  const stack = (
    await cf.send(new DescribeStacksCommand({ StackName: stackName }))
  ).Stacks?.[0]

  if (!stack)
    return {
      found: false,
      stackName,
    }

  return {
    createdAt: stack.CreationTime,
    driftInfo: stack.DriftInformation,
    found: true,
    outputs: stack.Outputs,
    stackName,
    status: stack.StackStatus as keyof typeof StackStatus,
    statusReason: stack.StackStatusReason,
    updatedAt: stack.LastUpdatedTime,
  }
}

export const getCfStackResources = async (stackName: string) => {
  const resources = (
    await cf.send(new DescribeStackResourcesCommand({ StackName: stackName }))
  ).StackResources

  if (!resources) return []

  return resources
}
