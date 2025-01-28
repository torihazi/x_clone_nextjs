import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { fileUrlAtom } from "@/features/jotai/file-url-atom";
import { type TweetForm, TweetFormSchema } from "@/lib/api/tweet";
import { useCreateTweet } from "@/lib/api/tweet";
import { uploadFilesToS3 } from "@/lib/s3/upload-files";

// ツイートフォームのロジックを管理するフック
export const useTweetForm = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentUrls, setCurrentUrls] = useAtom(fileUrlAtom);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TweetForm>({
    resolver: zodResolver(TweetFormSchema),
    defaultValues: {
      content: "",
      images: [],
    },
  });
  const { createTweet } = useCreateTweet({
    onSuccess: () => {
      toast.success("ツイートを作成しました");
      form.reset();
    },
  });

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
      if (textareaRef.current) {
        textareaRef.current.style.height = "24px";
      }
      form.reset();
    }
  };

  // ファイル追加の処理
  const addFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const currentFiles = form.getValues("images");
    const filelists = e.target.files;

    if (filelists) {
      const newFiles = Array.from(filelists);
      const combinedFiles = [...(currentFiles ?? []), ...newFiles];

      // 先にバリデーションを実行
      form.setValue("images", combinedFiles);
      const result = await form.trigger("images");

      if (result) {
        // バリデーション成功時のみURLを作成
        const urls = newFiles.map((file) => URL.createObjectURL(file));
        setCurrentUrls((prev) => [...prev, ...urls]);
      } else {
        // バリデーション失敗時は値をリセット
        form.setValue("images", currentFiles ?? []);
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
      form.setValue("images", currentFiles ?? []);
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
  // テキストエリアの高さを動的に調整
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "36px";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, []);

  return {
    addFiles,
    removeFiles,
    onSubmit,
    handleKeyDown,
    adjustHeight,
    form,
    isLoading,
    currentUrls,
    textareaRef,
  };
};
