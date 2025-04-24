import { Client } from 'minio'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
})

export const bucketName = process.env.MINIO_BUCKET_NAME!

export async function uploadFile(file: Buffer, fileName: string, contentType: string) {
  await minioClient.putObject(bucketName, fileName, file, {
    'Content-Type': contentType,
  })
  return fileName
}

export async function getFileUrl(fileName: string) {
  return await minioClient.presignedGetObject(bucketName, fileName, 60 * 60 * 24) // 24小时有效期
}

export async function deleteFile(fileName: string) {
  await minioClient.removeObject(bucketName, fileName)
}
