require('dotenv').config()
const AWS = require('aws-sdk')

const BUCKET_NAME = 'whoamai'
const REGION = 'eu-central-1'
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: REGION,
  signatureVersion: 'v4',
})

const uploadImageToS3 = async (fileName, body) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(body, 'base64'),
    ContentEncoding: 'base64',
    ContentType: 'image/png',
    ACL: 'public-read-write',
  }

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) reject(err)
      resolve(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`)
    })
  })
}

module.exports = uploadImageToS3
