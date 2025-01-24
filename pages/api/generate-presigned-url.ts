import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const { fileName, fileType } = req.body;
    const bucketName = process.env.AWS_BUCKET_NAME!;
    // TODO: tweetの部分をreq.bodyから渡せるようにして汎用化
    const s3Key = `tweet/${Math.random().toString(36).substring(2, 15)}_${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: s3Key,
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
