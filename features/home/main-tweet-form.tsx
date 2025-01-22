import { zodResolver } from "@hookform/resolvers/zod";
import {
  Videotape,
  List,
  Smile,
  Calendar,
  MapPin,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type TweetForm, TweetFormSchema } from "@/lib/api/tweet";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { fileUrlAtom } from "../jotai/file-url-atom";
import Image from "next/image";
export type inputIconItemType = {
  icon: React.ReactNode;
  tooltip: string;
};
export const inputIconItems: inputIconItemType[] = [
  {
    icon: <Videotape className="text-[#1C9BEF]" />,
    tooltip: "Gif",
  },
  {
    icon: <List className="text-[#1C9BEF]" />,
    tooltip: "Poll",
  },
  {
    icon: <Smile className="text-[#1C9BEF]" />,
    tooltip: "Emoji",
  },
  {
    icon: <Calendar className="text-[#1C9BEF]" />,
    tooltip: "Schedule",
  },
  {
    icon: <MapPin className="text-[#1C9BEF]" />,
    tooltip: "Geo",
  },
];

export default function MainTweetForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentUrls, setCurrentUrls] = useAtom(fileUrlAtom);

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

  const onSubmit: SubmitHandler<TweetForm> = (data) => {
    console.log(data);
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
      form.setValue("images", combinedFiles, { shouldDirty: true });
      const result = await form.trigger("images");

      if (result) {
        // バリデーション成功時のみURLを作成
        const urls = newFiles.map((file) => URL.createObjectURL(file));
        setCurrentUrls((prev) => [...prev, ...urls]);
      } else {
        // バリデーション失敗時は値をリセット
        form.setValue("images", currentFiles || []);
        // HandleFormError(form.formState.errors.images?.message as string);
      }
    }
  };

  // TODO: このtriggerの書き方だと意味ないと思う。
  // コメントアウトしたものが相応しいかと思うがそれだとrecoilが更新されない。
  const removeFiles = (currentUrl: string, index: number) => {
    const files = form.getValues("images");
    if (files) {
      form.setValue(
        "images",
        files?.filter((_, num) => num !== index),
        { shouldDirty: true },
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

  const result = TweetFormSchema.safeParse(form.getValues());
  console.log(result);

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
        <div className="flex overflow-x-auto gap-2">
          {currentUrls.length > 0 &&
            currentUrls.map((url, index) => (
              <div key={url} className="shrink-0 relative">
                <Image
                  alt={`画像${index}枚目`}
                  className="object-cover aspect-square rounded-lg"
                  src={`${url}`}
                  width={`${currentUrls.length === 1 ? 300 : 200}`}
                  height={`${currentUrls.length === 1 ? 300 : 200}`}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1 right-1 z-10 rounded-full"
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
            disabled={!form.formState.isValid}
          >
            Post
          </Button>
        </div>
      </div>
    </form>
  );
}
