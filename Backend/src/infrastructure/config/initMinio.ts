import { minioClient } from './minioClient';

export async function initMinioBucket(bucketName: string) {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
    console.log(`Bucket '${bucketName}' creado`);
  } else {
    console.log(`Bucket '${bucketName}' ya existe`);
  }
}
