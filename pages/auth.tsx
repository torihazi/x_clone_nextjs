import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Apple, Eye, EyeOff, Radius, X } from "lucide-react";
import Image from "next/image";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Auth() {
  const { isOpen, setIsOpen, open, close, toggle } = useDisclosure();
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex">
          {/* ロゴ */}
          <div className="flex-1 flex justify-center items-center">
            <Image src="/logo.svg" alt="logo" width={300} height={300} />
          </div>

          {/* 入力フォーム */}
          <div className="flex-1 p-4">
            <div className="flex flex-col p-4 h-full">
              <div className="my-10 text-6xl font-bold">
                すべての話題が、ここに。
              </div>
              <div className="text-4xl mb-5 font-bold">
                今すぐ参加しましょう
              </div>
              <div className="grow flex-1 flex flex-col gap-2 justify-between">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    className="w-[300px] rounded-full font-bold"
                  >
                    <Radius className="w-4 h-4" />
                    Google
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-[300px] rounded-full font-bold"
                  >
                    <Apple className="w-4 h-4" />
                    Apple
                  </Button>
                  <Separator className="w-[300px] my-5 flex justify-center border-gray-500">
                    または
                  </Separator>
                  <Button
                    className="w-[300px] rounded-full bg-sky-500 font-bold hover:bg-sky-600"
                    onClick={open}
                  >
                    メールアドレスで登録
                  </Button>
                  <p className="text-sm text-gray-500 mb-3">
                    アカウントを登録することにより、利用規約とプライバシーポリシー（Cookieの使用を含む）に同意したとみなされます。
                  </p>
                </div>
                <div className="flex flex-col mt-5">
                  <p className="text-sm text-gray-500">
                    アカウントをお持ちの方はこちら
                  </p>
                  <Button className="w-[300px] rounded-full">ログイン</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* フッター */}
        <div className="">
          <div className="font-sm text-gray-500">
            基本情報 Xアプリをダウンロード ヘルプセンター 利用規約
            プライバシーポリシー Cookieのポリシー アクセシビリティ 広告情報
            ブログ 採用情報 ブランドリソース 広告 マーケティング Xのビジネス活用
            開発者 プロフィール一覧 設定 © 2025 X Corp.
          </div>
        </div>
      </div>

      {/* ダイアログ */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-1">
          <div className="flex flex-col gap-2">
            {/* header */}
            <div className="flex justify-between items-center">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full p-1"
                onClick={close}
              >
                <X className="w-10 h-10" />
              </Button>
              <div>
                <Image src="/logo.svg" alt="logo" width={50} height={50} />
              </div>
              <div></div>
            </div>
            {/* body */}
            <div className="flex flex-col gap-5 px-10">
              <div className="text-3xl font-bold">アカウントを作成</div>
              <div className="items-center gap-4">
                <Label htmlFor="email" className="">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  value=""
                  className=""
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="password" className="">
                  パスワード
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    value="@peduart"
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
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="password_confirmation" className="">
                  確認用パスワード
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    value="@peduart"
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
              </div>
              <div className="flex justify-center items-center gap-4">
                <Button className="w-[300px] rounded-full bg-sky-500 font-bold hover:bg-sky-600">
                  アカウントを作成
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
