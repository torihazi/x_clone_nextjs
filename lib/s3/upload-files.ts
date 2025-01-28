import { type GeneratePresignedRequest } from "../api/presigned-url";

import { generatePresignedUrl } from "./generate-presigned-url";
import { uploadFileToPresignedUrl } from "./upload-file-to-presinged-url";

export async function uploadFilesToS3(
  images: File[],
  type: GeneratePresignedRequest["type"],
): Promise<string[]> {
  const result = await generatePresignedUrl(images, type);
  const s3Keys = await Promise.all(
    result.map(async (result) => {
      await uploadFileToPresignedUrl(result.presignedUrl, result.image);
      return result.s3Key;
    }),
  );

  return s3Keys;
}
