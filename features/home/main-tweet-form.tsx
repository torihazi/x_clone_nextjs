import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type TweetForm,
  TweetFormSchema,
  useCreateTweet,
} from "@/lib/api/tweet";
import { uploadFilesToS3 } from "@/lib/s3/upload-files";

import { fileUrlAtom } from "../jotai/file-url-atom";

import { inputIconItems } from "./input-icon-items";

export default function MainTweetForm() {
  // 独自のDOM操作を行うためのref
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

  const { ref: contentRef, ...restContentInput } = form.register("content");

  const onSubmit: SubmitHandler<TweetForm> = async (data) => {
    try {
      setIsLoading(true);
      if (data.images && data.images.length > 0) {
        const s3Keys = await uploadFilesToS3(data.images, "tweet");
        await createTweet({ content: data.content, s3Keys });
      } else {
        await createTweet({ content: data.content });
      }
    } catch (error) {
      console.error(error);
      toast.error("ツイートの作成に失敗しました");
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

  const removeFiles = async (currentUrl: string, index: number) => {
    const currentFiles = form.getValues("images");
    if (!currentFiles) return;

    form.setValue(
      "images",
      currentFiles.filter((_, num) => num !== index),
    );
    URL.revokeObjectURL(currentUrl);
    setCurrentUrls(currentUrls.filter((url) => url !== currentUrl));
    // バリデーションを実行
    const result = await form.trigger("images");

    if (result) {
      // バリデーション成功時のみURLを更新
      const urls = currentFiles.map((file) => URL.createObjectURL(file));
      setCurrentUrls(currentUrls.filter((url) => url !== currentUrl));
    } else {
      // バリデーション失敗時は値をリセット
      form.setValue("images", currentFiles || []);
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
                  aria-label="画像削除"
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
            aria-label="画像追加"
            type="button"
            size="icon"
            className="rounded-full bg-transparent p-1 hover:bg-current"
            onClick={() => document.getElementById("image-input")?.click()}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <ImageIcon className="text-[#1C9BEF]" />
          </Button>
          <input
            id="image-input"
            type="file"
            multiple
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={addFiles}
          />
          {inputIconItems.map((item) => (
            <Button
              aria-label={item.tooltip}
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
            aria-label="ツイート"
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
