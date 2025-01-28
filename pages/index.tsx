import Image from "next/image";
import { ReactNode } from "react";

import MainLayout from "@/components/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainTweetForm from "@/features/home/main-tweet-form";

const commonClasses = `
  grow
  h-full
  rounded-none
  bg-transparent
  transition-all
  hover:bg-white/10
  border-gray-800
  data-[state=active]:font-bold
  data-[state=active]:border-b-2
  data-[state=active]:border-b-[#1d9bf0]
`;

export type inputIconItemType = {
  icon: ReactNode;
  tooltip: string;
};

export default function Home() {
  return (
    <MainLayout>
      <div className="h-full">
        <Tabs defaultValue="for-you" className="h-full">
          <TabsList className="sticky top-0 z-10 h-12 w-full rounded-none border-b border-gray-800 bg-black p-0">
            <TabsTrigger
              value="for-you"
              className={`${commonClasses} border-l `}
            >
              For You
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className={`${commonClasses} border-r`}
            >
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you" className="mt-0 h-full">
            <div className="flex flex-col">
              <div className="flex border-x border-b border-gray-800 px-8 py-1">
                <div className="mr-2 mt-2">
                  <Image
                    src="/logo-white.png"
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex grow flex-col">
                  <MainTweetForm />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="following" className="mt-0 h-full">
            <div className="flex flex-col">
              <div className="flex border-x border-gray-800 px-8 py-1">
                <div className="mr-2">
                  <Image
                    src="/logo-white.png"
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex grow flex-col">
                  <MainTweetForm />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
