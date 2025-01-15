import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUp, SignUpSchema, SignUpSchemaType } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
};

export const SignUpDialog = ({ isOpen, setIsOpen, onClose }: Props) => {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    try {
      const response = await signUp(data);
      toast.success("認証メールを送信しました");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-1 h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-2">
          {/* header */}
          <div className="flex justify-between items-center">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full p-1 "
              onClick={onClose}
            >
              <X className="w-10 h-10 text-foreground" />
            </Button>
            <div className="flex-1 flex justify-center">
              <Image src="/logo-black.png" alt="logo" width={30} height={30} />
            </div>
            <div></div>
          </div>
          {/* body */}
          <div className="grow flex flex-col px-10">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grow flex flex-col gap-5 text-foreground"
            >
              <div className="text-3xl font-bold">アカウントを作成</div>
              <div className="grow flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-8">
                  <div className="items-center gap-4">
                    <Label htmlFor="email" className="">
                      メールアドレス
                    </Label>
                    <Input
                      id="email"
                      {...form.register("email")}
                      className=""
                      placeholder="example@gmail.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500">
                        {form.formState.errors.email?.message as string}
                      </p>
                    )}
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor="password" className="">
                      パスワード
                    </Label>
                    <PasswordInput form={form} name="password" />
                  </div>
                  <div className="items-center gap-4">
                    <Label htmlFor="password_confirmation" className="">
                      確認用パスワード
                    </Label>
                    <PasswordInput form={form} name="password_confirmation" />
                  </div>
                  <div className="text-sm text-gray-500">
                    アカウントを登録することにより、利用規約とプライバシーポリシー（Cookieの使用を含む）に同意したとみなされます。
                  </div>
                </div>
                <div className="flex justify-center items-center mb-8">
                  <Button
                    className="w-[300px] rounded-full bg-sky-500 font-bold hover:bg-sky-600"
                    onClick={() => form.handleSubmit(onSubmit)}
                  >
                    アカウントを作成
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
