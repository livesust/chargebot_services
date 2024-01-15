export * as S3 from "./s3";
import stream from "stream";

import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({});

// Get Object from S3
export const getObject = async (bucket: string, key: string): Promise<Uint8Array | undefined> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });


  try {
    const response = await s3Client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    return await response?.Body?.transformToByteArray();
  } catch (err) {
    console.error(err);
  }

  return undefined;
}

// Put Object from S3
export const putObject = async (bucket: string, key: string, body: Uint8Array): Promise<boolean | undefined> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body
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

// Read stream for downloading from S3
export const readStreamFromS3 = async ({
  Bucket,
  Key,
}: {
  Bucket: string;
  Key: string;
}) => {
  const commandPullObject = new GetObjectCommand({
    Bucket,
    Key,
  });
  const response = await s3Client.send(commandPullObject);

  return response;
}

// Write stream for uploading to S3
export const writeStreamToS3 = async ({ Bucket, Key }: { Bucket: string; Key: string }) => {
  const pass = new stream.PassThrough();
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket,
      Key,
      Body: pass,
    },
  });

  return {
    writeStream: pass,
    upload,
  };
}
