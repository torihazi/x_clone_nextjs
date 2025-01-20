import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInSchema, SignInSchemaType, signIn } from "@/lib/api/auth";

import { PasswordInput } from "./password-input";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};

export const SignInDialog = ({ isOpen, setIsOpen, onClose }: Props) => {
  const router = useRouter();
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    try {
      const response = await signIn(data);
      router.push("/");
      toast.success("ログインしました");
      console.log(response);
    } catch (error) {
      toast.error("ログインに失敗しました");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-[80vh] overflow-y-auto p-1">
        <div className="flex flex-col gap-2">
          {/* header */}
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full p-1"
              aria-label="閉じる"
              onClick={onClose}
            >
              <X className="size-10 text-foreground" />
            </Button>
            <div className="flex flex-1 justify-center">
              <Image src="/logo-black.png" alt="logo" width={30} height={30} />
            </div>
            <div></div>
          </div>
          {/* body */}
          <div className="flex grow flex-col px-10">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex grow flex-col gap-5 text-foreground"
            >
              <div className="text-3xl font-bold">ログイン</div>
              <div className="flex grow flex-col justify-between gap-4">
                <div className="flex flex-col gap-8">
                  <div className="items-center gap-4">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      {...form.register("email")}
                      placeholder="example@gmail.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500">
                        {form.formState.errors.email?.message as string}
                      </p>
                    )}
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor="password">パスワード</Label>
                    <PasswordInput form={form} name="password" />
                  </div>
                </div>
                <div className="mb-8 flex items-center justify-center">
                  <Button
                    className="w-[300px] rounded-full bg-sky-500 font-bold hover:bg-sky-600"
                    aria-label="ログイン"
                    type="submit"
                  >
                    ログイン
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
