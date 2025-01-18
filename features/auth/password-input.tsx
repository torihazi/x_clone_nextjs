import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
};

export const PasswordInput = <T extends FieldValues>({
  form,
  name,
}: Props<T>) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <div className="relative">
        <Input
          {...form.register(name)}
          type={isVisible ? "text" : "password"}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
          aria-label={isVisible ? "パスワードを非表示" : "パスワードを表示"}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <Eye className="size-5" />
          ) : (
            <EyeOff className="size-5" />
          )}
        </Button>
      </div>
      {form.formState.errors[name] && (
        <p className="text-red-500">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </>
  );
};
