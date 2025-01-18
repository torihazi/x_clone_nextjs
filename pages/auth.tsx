import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Apple, Radius } from "lucide-react";
import Image from "next/image";
import { useDisclosure } from "@/hooks/use-disclosure";
import { SignUpDialog } from "@/features/auth/sign-up-dialog";
export default function Auth() {
  const { isOpen, setIsOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1">
          {/* ロゴ */}
          <div className="flex flex-1 items-center justify-center">
            <Image src="/logo-white.png" alt="logo" width={300} height={300} />
          </div>

          {/* 入力フォーム */}
          <div className="flex-1 p-4">
            <div className="flex h-full flex-col p-4">
              <div className="my-10 text-6xl font-bold">
                すべての話題が、ここに。
              </div>
              <div className="mb-5 text-4xl font-bold">
                今すぐ参加しましょう
              </div>
              <div className="flex flex-1 grow flex-col justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    className="w-[300px] rounded-full font-bold"
                    aria-label="Googleで登録"
                  >
                    <Radius className="size-4" />
                    Google
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-[300px] rounded-full font-bold"
                    aria-label="Appleで登録"
                  >
                    <Apple className="size-4" />
                    Apple
                  </Button>
                  <Separator className="my-5 flex w-[300px] justify-center border-gray-500">
                    または
                  </Separator>
                  <Button
                    className="w-[300px] rounded-full bg-sky-500 font-bold hover:bg-sky-600"
                    onClick={open}
                    aria-label="メールアドレスで登録"
                  >
                    メールアドレスで登録
                  </Button>
                  <p className="mb-3 w-[300px] text-sm text-gray-500">
                    アカウントを登録することにより、利用規約とプライバシーポリシー（Cookieの使用を含む）に同意したとみなされます。
                  </p>
                </div>
                <div className="mt-5 flex flex-col">
                  <p className="text-sm text-gray-500">
                    アカウントをお持ちの方はこちら
                  </p>
                  <Button
                    variant="secondary"
                    className="w-[300px] rounded-full font-bold text-sky-500"
                    aria-label="ログイン"
                  >
                    ログイン
                  </Button>
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
      <SignUpDialog isOpen={isOpen} setIsOpen={setIsOpen} onClose={close} />
    </>
  );
}
