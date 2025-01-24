import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { fileName, fileType, type } = req.body;
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const s3Key = `${Math.random().toString(36).substring(2, 15)}_${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: `${type}/${s3Key}`,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    res.status(200).json({ url: presignedUrl, s3Key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}
