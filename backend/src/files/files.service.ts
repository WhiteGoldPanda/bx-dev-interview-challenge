import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  private s3: S3;
  private readonly bucket = process.env.S3_BUCKET_NAME!;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: 'v4',
    });
  }

  async presignUpload(key: string, contentType: string, expiresSec = 300) {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      Expires: expiresSec,
    });
  }

  async presignDownload(key: string, expiresSec = 300) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresSec,
    });
  }

  async list(prefix?: string) {
    const res = await this.s3
      .listObjectsV2({ Bucket: this.bucket, Prefix: prefix || '' })
      .promise();
    return (res.Contents || []).map((o) => ({
      key: o.Key!,
      size: o.Size || 0,
      lastModified: o.LastModified || new Date(),
    }));
  }
}
