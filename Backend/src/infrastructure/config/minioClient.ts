import { Client } from 'minio'
import dotenv from 'dotenv'

dotenv.config()

// Parseamos la URL de Minio
const minioUrl = new URL(process.env.MINIO_URL ?? 'http://minio:9000')
const host = minioUrl.hostname             // e.g. "minio"
const port = parseInt(minioUrl.port, 10)   // e.g. 9000
const useSSL = minioUrl.protocol === 'https:'

console.log(`Connecting to Minio at ${host}:${port} (SSL=${useSSL})`)

export const minioClient = new Client({
  endPoint: host,
  port,
  useSSL,
  accessKey: process.env.MINIO_ROOT_USER  ?? '',
  secretKey: process.env.MINIO_ROOT_PASSWORD ?? '',
})

// Para URLs públicas apunta al bucket o a la carpeta de uploads
export const minioPublicUrl = process.env.MINIO_PUBLIC_URL
  ?? `${minioUrl.origin}/uploads`
