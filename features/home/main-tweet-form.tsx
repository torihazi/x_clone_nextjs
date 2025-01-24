import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type TweetForm,
  TweetFormSchema,
  useCreateTweet,
} from "@/lib/api/tweet";

import { fileUrlAtom } from "../jotai/file-url-atom";

import { inputIconItems } from "./input-icon-items";
import { toast } from "react-toastify";
import axios from "axios";

export default function MainTweetForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentUrls, setCurrentUrls] = useAtom(fileUrlAtom);
  const [isLoading, setIsLoading] = useState(false);
  const { createTweet } = useCreateTweet({
    onSuccess: () => {
      toast.success("ツイートを作成しました");
      form.reset();
    },
  });

  const form = useForm<TweetForm>({
    resolver: zodResolver(TweetFormSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      images: [],
    },
  });

  const { ref: imagesRef, ...restImagesInput } = form.register("images");
  const { ref: contentRef, ...restContentInput } = form.register("content");

  const onSubmit: SubmitHandler<TweetForm> = async (data) => {
    try {
      setIsLoading(true);
      // 画像があった場合 APIroutesを使用してpresigned urlを取得
      // TODO: data.imagesを渡したらs3Keyの配列を返すhookを作成
      if (data.images && data.images.length > 0) {
        const results = await Promise.all(
          data.images.map(async (image) => {
            const response = await axios.post("/api/generate-presigned-url", {
              fileName: image.name,
              fileType: image.type,
            });
            return {
              image: image,
              url: response.data.url,
              s3Key: response.data.s3Key,
            };
          }),
        );

        // 取得したpresigned urlを使用してs3に画像をアップロード
        const uploadResults: string[] = await Promise.all(
          results.map(async (result) => {
            await axios.put(result.url, result.image, {
              headers: {
                "Content-Type": result.image.type,
              },
            });
            return result.s3Key;
          }),
        );

        console.log(uploadResults);

        // アップロードした画像のs3_keyを取得
        // 取得したs3_key(string[])とcontentをAPIに送信
        await createTweet({ content: data.content, s3_keys: uploadResults });
      } else {
        // 画像がなかった場合はcontentだけ送信
        await createTweet({ content: data.content });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setCurrentUrls([]);
      form.reset();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  // ファイル追加の処理
  const addFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const currentFiles = form.getValues("images");
    const filelists = e.target.files;

    if (filelists) {
      const newFiles = Array.from(filelists);
      const combinedFiles = [...(currentFiles || []), ...newFiles];

      // 先にバリデーションを実行
      form.setValue("images", combinedFiles);
      const result = await form.trigger("images");

      if (result) {
        // バリデーション成功時のみURLを作成
        const urls = newFiles.map((file) => URL.createObjectURL(file));
        setCurrentUrls((prev) => [...prev, ...urls]);
      } else {
        // バリデーション失敗時は値をリセット
        form.setValue("images", currentFiles || []);
      }
    }
  };

  const removeFiles = (currentUrl: string, index: number) => {
    const files = form.getValues("images");
    if (files) {
      form.setValue(
        "images",
        files?.filter((_, num) => num !== index),
      );
      URL.revokeObjectURL(currentUrl);
      setCurrentUrls(currentUrls.filter((url) => url !== currentUrl));

      form.trigger("images");
    }
  };

  // テキストエリアの高さを動的に調整
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "24px";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="border-b border-gray-800">
        <Textarea
          className="min-h-[24px] resize-none border-none p-2 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="What's happening?"
          {...restContentInput}
          ref={(el) => {
            contentRef(el);
            textareaRef.current = el;
          }}
          onChange={(el) => {
            restContentInput.onChange(el);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
        />

        {/* 画像プレビュー挿入 */}
        <div className="flex gap-2 overflow-x-auto">
          {currentUrls.length > 0 &&
            currentUrls.map((url, index) => (
              <div key={url} className="relative shrink-0">
                <Image
                  alt={`画像${index}枚目`}
                  className="aspect-square rounded-lg object-cover"
                  src={url}
                  width={`${currentUrls.length === 1 ? 300 : 200}`}
                  height={`${currentUrls.length === 1 ? 300 : 200}`}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-1 top-1 z-10 rounded-full"
                  onClick={() => removeFiles(url, index)}
                >
                  <X />
                </Button>
              </div>
            ))}
        </div>

        {/* エラーメッセージ */}
        {form.formState.errors.content && (
          <p className="text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
        {form.formState.errors.images && (
          <p className="text-red-500">{form.formState.errors.images.message}</p>
        )}
      </div>
      <div className="flex justify-between py-2">
        <div>
          <Button
            type="button"
            size="icon"
            className="rounded-full bg-transparent p-1 hover:bg-current"
            onClick={() => inputRef.current?.click()}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <ImageIcon className="text-[#1C9BEF]" />
          </Button>
          <input
            ref={(el) => {
              imagesRef(el);
              inputRef.current = el;
            }}
            type="file"
            multiple
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            {...restImagesInput}
            onChange={addFiles}
          />
          {inputIconItems.map((item) => (
            <Button
              key={item.tooltip}
              size="icon"
              className="rounded-full bg-transparent p-1 hover:bg-current "
            >
              {item.icon}
            </Button>
          ))}
        </div>
        <div>
          <Button
            type="submit"
            className="rounded-full font-bold"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
