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
  const [isVisible, setIsVisible] = useState(true);
  return (
    <>
      <div className="relative">
        <Input
          {...form.register(name)}
          className=""
          type={isVisible ? "text" : "password"}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
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
