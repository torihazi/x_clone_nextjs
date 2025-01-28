import { NextApiRequest, NextApiResponse } from "next";

import { generatePresignedRequestSchema } from "@/lib/api/presigned-url";
import { s3Service } from "@/lib/s3/s3-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { fileName, fileType, type } = req.body;
    const result = generatePresignedRequestSchema.safeParse({
      fileName,
      fileType,
      type,
    });

    if (!result.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const { url, s3Key } = await s3Service.getPresignedUrl(
      result.data.fileName,
      result.data.fileType,
      result.data.type,
    );

    res.status(200).json({ url, s3Key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}
