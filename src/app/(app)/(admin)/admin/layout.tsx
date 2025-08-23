"use client";

import type React from "react";

import Sidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="flex-1 p-8 overflow-auto w-full">
        <header className="mb-8 w-full flex justify-center items-center gap-4 bg-gray-100 rounded-xl px-4 py-4">
          {/* Burger button chỉ hiện trên mobile */}
          <button
            className="lg:hidden p-2 bg-white rounded-lg shadow text-gray-700 hover:text-blue-600 transition-colors text-2xl"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Open sidebar menu"
          >
            <Menu size={32} />
          </button>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Tân Trang Admin</h1>
            <p className="text-xs text-gray-400 mt-2">
              Vui lòng sử dụng Laptop hay máy tính bàn để sử dụng {""}
              <strong>Tân Trang Admin</strong>
            </p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
