import {
  Home,
  Search,
  Bell,
  MessageCircle,
  Users,
  User,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "../ui/button";

export default function NavBar() {
  const router = useRouter();
  const columns: { icon: React.ReactNode; title: string; path: string }[] = [
    { icon: <Home className="size-7" />, title: "Home", path: "/" },
    { icon: <Search className="size-7" />, title: "Explore", path: "/explore" },
    {
      icon: <Bell className="size-7" />,
      title: "Notifications",
      path: "/notifications",
    },
    {
      icon: <MessageCircle className="size-7" />,
      title: "Messages",
      path: "/messages",
    },
    {
      icon: <Users className="size-7" />,
      title: "Communities",
      path: "/communities",
    },
    { icon: <User className="size-7" />, title: "Profile", path: "/profile" },
    {
      icon: <MoreHorizontal className="size-7" />,
      title: "Settings",
      path: "/settings",
    },
  ];

  return (
    <>
      <div className="flex flex-col items-start gap-5">
        <Button
          variant="ghost"
          className="rounded-full p-2"
          aria-label="ホーム"
        >
          <Image src="/logo-white.png" alt="logo" width={30} height={30} />
        </Button>
        {columns.map((column) => (
          <Button
            aria-label={column.title}
            variant="ghost"
            className="text-md gap-4 rounded-full p-1 font-bold"
            key={column.title}
            onClick={() => router.push(column.path)}
          >
            {column.icon}
            {column.title}
          </Button>
        ))}
        <Button
          aria-label="ツイート"
          className="text-md w-full gap-4 rounded-full px-3 font-bold"
        >
          POST
        </Button>
      </div>
      <div className="flex flex-col items-start justify-start">
        <Button
          aria-label="ユーザー"
          variant="ghost"
          className="gap-4 rounded-full p-1"
        >
          <User className="size-7" />
          hgoehgoe
        </Button>
      </div>
    </>
  );
}
