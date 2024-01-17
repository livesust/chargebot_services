export * as S3 from "./s3";
import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

// Get URL to directly PUT an image into S3
export const getUploadUrl = async (bucket: string, key: string): Promise<unknown> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ACL: "public-read"
  });
  return await getSignedUrl(s3Client, command);
}

// Get URL to directly GET an image from S3
export const getDownloadUrl = async (bucket: string, key: string): Promise<unknown> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  if (await exists(bucket, key)){
    return await getSignedUrl(s3Client, command);
  }
}

// Get Object from S3
export const getObject = async (bucket: string, key: string): Promise<string | undefined> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });


  try {
    const response = await s3Client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    return await response?.Body?.transformToString();
  } catch (err) {
    console.error(err);
  }

  return undefined;
}

// Put Object from S3
export const putObject = async (bucket: string, key: string, body: Uint8Array, contentType: string): Promise<boolean | undefined> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });


  try {
    const response = await s3Client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    return response?.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.error(err);
  }

  return undefined;
}

// Put Object from S3
export const exists = async (bucket: string, key: string): Promise<boolean | undefined> => {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (err) {
    // @ts-expect-error ignore unknow type
    if (err.name === 'NotFound') {
      // Note with v2 AWS-SDK use error.code, v3 uses error.name
      return false
    } else {
      console.error(err);
    }
  }
}
