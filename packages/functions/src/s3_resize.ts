import sharp from "sharp";
import { S3 } from "@chargebot-services/core/services/aws/s3";

const width = 400;
const prefix = `${width}w`;

// Sharp resize stream
const streamToSharp = (width: number) => {
  return sharp().resize(width);
}

import { S3Handler } from "aws-lambda";

export const main: S3Handler = async (event) => {
  const s3Record = event.Records[0].s3;

  // Grab the filename and bucket name
  const key = s3Record.object.key;
  const bucket = s3Record.bucket.name;

  // Check if the file has already been resized
  if (key.startsWith(prefix)) {
    return;
  }

  // Create the new filename with the dimensions
  const newKey = `${prefix}-${key}`;

  // Stream to read the file from the bucket
  const readStream = await S3.readStreamFromS3({ Key: key, Bucket: bucket });

  // Stream to resize the image
  const resizeStream = streamToSharp(width);

  // Stream to upload to the bucket
  // @ts-expect-error ignore typing
  const { writeStream, upload } = S3.writeStreamToS3({
    Bucket: bucket,
    Key: newKey,
  });

  // Trigger the streams
  (readStream?.Body as NodeJS.ReadableStream)
    .pipe(resizeStream)
    .pipe(writeStream);

  try {
    // Wait for the file to upload
    await upload.done();
  } catch (err) {
    console.log(err);
  }
};