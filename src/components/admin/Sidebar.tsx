"use client";

import {
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
    icon: <LayoutDashboard size={24} />,
    href: "/admin",
  },
  {
    label: "Tin tức",
    icon: <Newspaper size={24} />,
    href: "/admin/news",
  },
  {
    label: "Năm Phụng Vụ",
    icon: <Calendar size={24} />,
    href: "/admin/liturgical-years",
  },
  {
    label: "Kinh Thánh",
    icon: <ScrollText size={24} />,
    href: "/admin/bible-readings",
  },
  {
    label: "Thiếu nhi Thánh Thể",
    icon: <Heart size={24} />,
    href: "/admin/tntt",
  },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-0 lg:inset-y-0 left-0 z-[101] bg-white shadow-md flex flex-col transform transition-transform duration-300 ease-in-out
        w-full h-full p-6 lg:w-auto lg:h-auto lg:max-w-none lg:p-6
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        overflow-y-auto`}
      >
        <div className="flex items-center mb-12 lg:mb-10">
          <span className="ml-2 font-bold text-2xl md:text-2xl break-words">
            Tân Trang Admin
          </span>
        </div>
        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-gradient-to-r hover:from-[#FF2CDF] hover:to-[#0014FF] text-gray-700 hover:text-white transition min-w-0 text-base font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span className="truncate block w-full text-left">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <Image
            src="/avatar.png"
            alt="User"
            width={48}
            height={48}
            className="rounded-full mx-auto"
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
