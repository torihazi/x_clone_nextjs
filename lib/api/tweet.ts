import { type AxiosResponse } from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

import {
  bytesToMB,
  calculateTotalSize,
  validateImageExtension,
} from "@/hooks/image-validation";
import { type Tweet } from "@/type/tweet";

import { apiClient } from "./api-client";

const KEY = "tweet";

// -----------------------
// index tweet
// -----------------------

export const indexTweetApi = async () => {
  const response: AxiosResponse<Tweet[]> = await apiClient.get("/v1/tweets");
  return response;
};

export const useIndexTweet = () => {
  const key = [KEY];
  const fetcher = () => indexTweetApi();
  const { data } = useSWR(key, fetcher, { suspense: true });
  return { data };
};

// -----------------------
// create tweet
// -----------------------

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
    path: ["content"],
  });

export type TweetForm = z.infer<typeof TweetFormSchema>;

export async function createTweet(
  url: string,
  { arg }: { arg: { content?: string; s3Keys?: string[] } },
) {
  await apiClient.post(url, arg);
}

export const useCreateTweet = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { trigger, isMutating } = useSWRMutation("/v1/tweets", createTweet, {
    onSuccess: () => onSuccess?.(),
  });

  return {
    createTweet: trigger,
    isLoading: isMutating,
  };
};
