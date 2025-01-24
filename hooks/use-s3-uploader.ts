import axios from "axios";
export const useS3Uploader = () => {
  const uploadToS3 = async (
    results: { image: File; presignedUrl: string; s3Key: string }[],
  ): Promise<string[]> => {
    return await Promise.all(
      results.map(async (result) => {
        await axios.put(result.presignedUrl, result.image, {
          headers: {
            "Content-Type": result.image.type,
          },
        });
        return result.s3Key;
      }),
    );
  };

  return { uploadToS3 };
};
