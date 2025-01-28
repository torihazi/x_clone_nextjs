import axios from "axios";

export async function uploadFileToPresignedUrl(
  presignedUrl: string,
  file: File,
): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
}
