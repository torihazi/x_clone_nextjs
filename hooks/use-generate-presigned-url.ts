import axios from "axios";

export const useGeneratePresignedUrl = () => {
  const getPresignedUrl = async (
    images: File[],
    type: string,
  ): Promise<{ image: File; presignedUrl: string; s3Key: string }[]> => {
    return await Promise.all(
      images.map(async (image) => {
        const response = await axios.post("/api/generate-presigned-url", {
          fileName: image.name,
          fileType: image.type,
          type: type,
        });
        return {
          image: image,
          presignedUrl: response.data.url,
          s3Key: response.data.s3Key,
        };
      }),
    );
  };

  return { getPresignedUrl };
};
