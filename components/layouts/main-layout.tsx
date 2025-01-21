import NavBar from "./nav-bar";
import SubSideBar from "./sub-side-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen lg:mx-24">
      <NavBar />
      <div className="grow">{children}</div>
      <SubSideBar />
    </div>
  );
}
