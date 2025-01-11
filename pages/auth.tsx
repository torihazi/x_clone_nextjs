import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Apple, Radius } from "lucide-react";
import Image from "next/image";

export default function Auth() {
  return (
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
            <div className="text-4xl mb-5 font-bold">今すぐ参加しましょう</div>
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
                <Button className="w-[300px] rounded-full bg-sky-500 font-bold">
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
          プライバシーポリシー Cookieのポリシー アクセシビリティ 広告情報 ブログ
          採用情報 ブランドリソース 広告 マーケティング Xのビジネス活用 開発者
          プロフィール一覧 設定 © 2025 X Corp.
        </div>
      </div>
    </div>
  );
}
