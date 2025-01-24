import { useGeneratePresignedUrl } from "./use-generate-presigned-url";
import { useS3Uploader } from "./use-s3-uploader";

export const useS3Upload = () => {
  const { getPresignedUrl } = useGeneratePresignedUrl();
  const { uploadToS3 } = useS3Uploader();

  const upload = async (images: File[], type: string) => {
    const results = await getPresignedUrl(images, type);
    const uploadResults = await uploadToS3(results);
    return uploadResults;
  };

  return { upload };
};
