"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { adminAPI, type AdminUser } from "@/lib/api/admin.api";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

interface AdminPermissions {
  canManageAdmins: boolean;
  canManageNews: boolean;
  canManageTntt: boolean;
  canManageBible: boolean;
  canViewStats: boolean;
}

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canManageAdmins: false,
    canManageNews: false,
    canManageTntt: false,
    canManageBible: false,
    canViewStats: false,
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const admin = await adminAPI.getProfile();

        const rolePermissions = getRolePermissions(admin.role);
        setPermissions(rolePermissions);

        console.log(
          "[v0] Admin role:",
          admin.role,
          "Permissions:",
          rolePermissions
        );
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setPermissions({
          canManageAdmins: false,
          canManageNews: false,
          canManageTntt: false,
          canManageBible: false,
          canViewStats: false,
        });
        // Optional: force re-auth UX
        handleLogout();
      }
    };

    fetchPermissions();
  }, []);

  const getRolePermissions = (role: AdminUser["role"]): AdminPermissions => {
    switch (role) {
      case "SUPER_ADMIN":
        return {
          canManageAdmins: true,
          canManageNews: true,
          canManageTntt: true,
          canManageBible: true,
          canViewStats: true,
        };
      case "NEWS_ADMIN":
        return {
          canManageAdmins: false,
          canManageNews: true,
          canManageTntt: false,
          canManageBible: false,
          canViewStats: true,
        };
      case "TNTT_ADMIN":
        return {
          canManageAdmins: false,
          canManageNews: false,
          canManageTntt: true,
          canManageBible: false,
          canViewStats: true,
        };
      case "BIBLE_ADMIN":
        return {
          canManageAdmins: false,
          canManageNews: false,
          canManageTntt: false,
          canManageBible: true,
          canViewStats: true,
        };
      default:
        return {
          canManageAdmins: false,
          canManageNews: false,
          canManageTntt: false,
          canManageBible: false,
          canViewStats: false,
        };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const menuItems = [
    {
      href: "/admin",
      icon: Home,
      label: "Dashboard",
      show: true,
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Quản lý Admin",
      show: permissions.canManageAdmins,
    },
    {
      href: "/admin/news",
      icon: FileText,
      label: "Tin tức chung",
      show: permissions.canManageNews,
    },
    {
      href: "/admin/tntt",
      icon: Users,
      label: "Tin tức TNTT",
      show: permissions.canManageTntt,
    },
    {
      href: "/admin/bible",
      icon: BookOpen,
      label: "Kinh Thánh",
      show: permissions.canManageBible,
    },
    {
      href: "/admin/liturgical",
      icon: Calendar,
      label: "Năm phụng vụ",
      show: permissions.canManageBible,
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Cài đặt",
      show: true,
    },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              if (!item.show) return null;

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive ?
                        "bg-emerald-100 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
