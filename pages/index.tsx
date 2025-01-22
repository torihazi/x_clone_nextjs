import MainLayout from "@/components/layouts/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              {/* form */}
              <div className="flex border-x border-gray-800 px-2 py-1">
                <div></div>
                <div className="flex flex-col">
                  <div></div>
                  <div></div>
                </div>
              </div>

              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
              <div className="h-40 border border-gray-800 px-2 py-1">hgoe</div>
            </div>
          </TabsContent>
          <TabsContent value="following" className="mt-0 h-full">
            <div className="border-x border-gray-800 px-2 py-1">hoge</div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
