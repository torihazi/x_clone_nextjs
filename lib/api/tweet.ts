import { z } from "zod";

import {
  bytesToMB,
  calculateTotalSize,
  validateImageExtension,
} from "@/hooks/image-validation";

export const TweetFormSchema = z
  .object({
    content: z.string(),
    images: z
      .custom<File[]>()
      .refine((files) => files.length <= 4, {
        message: "画像は4枚までアップロードできます",
      })
      .refine((files) => bytesToMB(calculateTotalSize(files)) <= 5, {
        message: "最大ファイルサイズは5MBです",
      })
      .refine((files) => validateImageExtension(files), {
        message: "PNGもしくはJPEGの画像をアップロードしてください",
      }),
  })
  .partial()
  .refine((data) => data.content || (data.images && data.images.length > 0), {
    message: "内容または画像を入力してください",
    path: ["content", "images"],
  });

export type TweetForm = z.infer<typeof TweetFormSchema>;
