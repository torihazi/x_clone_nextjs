import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTweetForm } from "@/hooks/use-tweet-form";

import { inputIconItems } from "./input-icon-items";

export default function MainTweetForm() {
  const {
    addFiles,
    removeFiles,
    onSubmit,
    handleKeyDown,
    adjustHeight,
    form,
    isLoading,
    currentUrls,
    textareaRef,
  } = useTweetForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="border-b border-gray-800">
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <Textarea
              className="min-h-[36px] resize-none border-none p-2 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="What's happening?"
              {...field}
              ref={(el) => {
                field.ref(el);
                textareaRef.current = el;
              }}
              onChange={(el) => {
                field.onChange(el);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
            />
          )}
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
