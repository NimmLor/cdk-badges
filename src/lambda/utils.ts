/* eslint-disable no-console */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const BUCKET_NAME = process.env.BUCKET_NAME

if (BUCKET_NAME === undefined || BUCKET_NAME === '')
  throw new Error('BUCKET_NAME is not defined.')

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
