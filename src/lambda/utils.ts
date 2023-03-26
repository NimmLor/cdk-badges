/* eslint-disable no-console */
import type { Stack, StackStatus } from '@aws-sdk/client-cloudformation'
import {
  CloudFormationClient,
  DescribeStackResourcesCommand,
  DescribeStacksCommand,
} from '@aws-sdk/client-cloudformation'
import {
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

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
const s3 = new S3Client({})

const {
  CACHE_CONTROL,
  HOUR12,
  LOCALE,
  TIMEZONE,
  BASE_URL,
  STACK_NAME,
  BUCKET_NAME,
} = process.env

if (
  CACHE_CONTROL === undefined ||
  HOUR12 === undefined ||
  LOCALE === undefined ||
  TIMEZONE === undefined ||
  BASE_URL === undefined ||
  STACK_NAME === undefined ||
  BUCKET_NAME === undefined
) {
  throw new Error('Missing required environment variables')
}

export const LambdaEnvironment = {
  BASE_URL,
  BUCKET_NAME,
  CACHE_CONTROL,
  HOUR12,
  LOCALE,
  STACK_NAME,
  TIMEZONE,
}

export const getLocalization = () => {
  return {
    hour12: HOUR12 === 'true',
    locale: LOCALE,
    timezone: TIMEZONE,
  }
}

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

export const listS3Badges = async (prefix?: string) => {
  const items = await s3.send(
    new ListObjectsCommand({ Bucket: BUCKET_NAME, Prefix: prefix })
  )

  const badges =
    items.Contents?.map((item) => ({
      key: item.Key,
      updatedAt: item.LastModified,
      url: `${BASE_URL}/${item.Key}`,
    })) ?? []

  return badges
}
