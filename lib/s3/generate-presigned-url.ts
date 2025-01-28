import axios from "axios";

import { type GeneratePresignedRequest } from "../api/presigned-url";

export async function generatePresignedUrl(
  images: File[],
  type: GeneratePresignedRequest["type"],
): Promise<{ image: File; presignedUrl: string; s3Key: string }[]> {
  return await Promise.all(
    images.map(async (image) => {
      const result = await axios.post("/api/generate-presigned-url", {
        fileName: image.name,
        fileType: image.type,
        type,
      });
      return {
        image,
        presignedUrl: result.data.url,
        s3Key: result.data.s3Key,
      };
    }),
  );
}
