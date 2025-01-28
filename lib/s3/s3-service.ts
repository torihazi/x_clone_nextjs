import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3クライアントの初期化と共通のS3操作を管理するクラス
class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;
  }

  getClient() {
    return this.s3Client;
  }

  getBucketName() {
    return this.bucketName;
  }

  async getPresignedUrl(
    fileName: string,
    fileType: string,
    type: string,
  ): Promise<{ url: string; s3Key: string }> {
    const s3Key = `${Math.random().toString(36).substring(2, 15)}_${fileName}`;
    const params = {
      Bucket: this.bucketName,
      Key: `${type}/${s3Key}`,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return { url: presignedUrl, s3Key };
  }
}

export const s3Service = new S3Service();
