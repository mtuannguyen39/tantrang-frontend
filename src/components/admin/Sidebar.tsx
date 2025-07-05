import {
  Home,
  LayoutDashboard,
  Calendar,
  ScrollText,
  Newspaper,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/admin",
  },
  {
    label: "Tin tức",
    icon: <Newspaper size={20} />,
    href: "/admin/news",
  },
  {
    label: "Năm Phụng Vụ",
    icon: <Calendar size={20} />,
    href: "/admin/liturgical-years",
  },
  {
    label: "Kinh Thánh",
    icon: <ScrollText size={20} />,
    href: "/admin/bible-readings",
  },
  {
    label: "Thiếu nhi Thánh Thể",
    icon: <Heart size={20} />,
    href: "/admin/tntt",
  },
];
const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-10">
        <span className="ml-2 font-bold text-xl">Tân Trang Admin</span>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#FF2CDF] hover:to-[#0014FF] text-gray-700 hover:text-white transition"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Image
          src="/avatar.png"
          alt="User"
          width={40}
          height={40}
          className="rounded-full mx-auto"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
