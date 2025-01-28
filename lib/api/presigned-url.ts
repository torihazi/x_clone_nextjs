import { z } from "zod";

export const generatePresignedRequestSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  type: z.enum(["tweet"]),
});

export type GeneratePresignedRequest = z.infer<
  typeof generatePresignedRequestSchema
>;
