import NavBar from "./nav-bar";
import SubSideBar from "./sub-side-bar";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="">
        <NavBar />
      </div>
      <div className="grow">{children}</div>
      <div className="">
        <SubSideBar />
      </div>
    </div>
  );
}
