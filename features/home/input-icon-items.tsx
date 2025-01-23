import { Videotape, List, Smile, Calendar, MapPin } from "lucide-react";

export type inputIconItemType = {
  icon: React.ReactNode;
  tooltip: string;
};
export const inputIconItems: inputIconItemType[] = [
  {
    icon: <Videotape className="text-[#1C9BEF]" />,
    tooltip: "Gif",
  },
  {
    icon: <List className="text-[#1C9BEF]" />,
    tooltip: "Poll",
  },
  {
    icon: <Smile className="text-[#1C9BEF]" />,
    tooltip: "Emoji",
  },
  {
    icon: <Calendar className="text-[#1C9BEF]" />,
    tooltip: "Schedule",
  },
  {
    icon: <MapPin className="text-[#1C9BEF]" />,
    tooltip: "Geo",
  },
];
