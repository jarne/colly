/**
 * Colly | S3 storage provider
 */

import { S3Client } from "@aws-sdk/client-s3"

export const client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET,
    },
})
