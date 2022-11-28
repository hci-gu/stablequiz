import { config } from 'dotenv'
config()

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const REGION = 'eu-central-1'
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}
const s3Client = new S3Client({ region: REGION, credentials })

export const createSignedUrl = async (fileName, body) => {
  const command = new PutObjectCommand({
    Bucket: `whoamai`,
    Key: fileName,
    Body: body,
  })
  const signedUrl = await getSignedUrl(s3Client, command)
  return signedUrl
}
