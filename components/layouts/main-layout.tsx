import NavBar from "./nav-bar";
import SubSideBar from "./sub-side-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen">
      <div className="fixed left-0 top-0 z-10 flex h-full flex-col justify-between px-2 lg:w-60">
        <NavBar />
      </div>
      <div className="mx-60 grow">{children}</div>
      <div className="fixed right-0 top-0 z-10 flex h-full flex-col justify-between overflow-y-auto px-2 lg:w-60">
        <SubSideBar />
      </div>
    </div>
  );
}
