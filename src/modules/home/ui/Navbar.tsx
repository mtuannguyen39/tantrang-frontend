"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div>
      <header className="bg-[#7b1fa2] text-white text-center py-4">
        <h1 className="text-lg font-bold">GIÁO XỨ TÂN TRANG</h1>
        <p className="text-sm">Giáo phận Sài Gòn</p>
      </header>
      {/* Navigation */}
      <nav className="flex flex-grow justify-center mx-4 max-md:hidden">
        <ul className="flex space-x-6 text-gray-700 font-semibold p-2">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <p>Trang chủ</p>
            </Link>
          </li>
          <li>
            <Link
              href="/gioi-thieu"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <p>Giới Thiệu</p>
            </Link>
          </li>
          <li>
            <Link
              href="/lien-he"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <p>Liên hệ</p>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Thanh tìm kiếm */}
      <div className="relative max-md:w-full max-md:mt-3">
        <input
          type="text"
          placeholder="Tìm kiếm...."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.313 0 6 2.687 6 6s-2.687 6-6 6-6-2.687-6-6 2.687-6 6-6z" />
        </svg>
      </div>

      {/* Menu */}
      {(pathname === "/" ||
        pathname.startsWith("/news") ||
        pathname.startsWith("/tntt") ||
        pathname.startsWith("/bible-reading") ||
        pathname.startsWith("/liturgical-year")) && (
        <div className="py-3 px-6 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 justify-center text-sm">
          <Link
            href="/"
            className={`rounded-full py-2 cursor-pointer px-4 ${
              pathname === "/"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            Tất cả
          </Link>
          <Link
            href="/news"
            className={`rounded-full py-2 cursor-pointer px-4 ${
              pathname === "/news"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            Tin tức chung
          </Link>
          <Link
            href="/tntt"
            className={`rounded-full py-2 cursor-pointer px-4 ${
              pathname === "/tntt"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            Thiếu Nhi Thánh Thể
          </Link>
          <Link
            href="/bible-reading"
            className={`rounded-full py-2 cursor-pointer px-4 ${
              pathname === "/bible-reading"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            Lời Chúa
          </Link>
          <Link
            href="/liturgical-year"
            className={`rounded-full py-2 cursor-pointer px-4 ${
              pathname === "/liturgical-year"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            } transition-all duration-200`}
          >
            Năm Phụng Vụ
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
