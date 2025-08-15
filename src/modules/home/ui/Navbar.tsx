"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import axios from "axios";

interface LiturgicalYearProps {
  id: number;
  name: string;
  code: string;
  year: number;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [liturgicalYears, setLiturgicalYears] = useState<LiturgicalYearProps[]>(
    []
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<LiturgicalYearProps[]>("http://localhost:3001/api/year")
      .then((res) => setLiturgicalYears(res.data));
  }, []);

  // Nhóm dữ liệu theo năm
  const groupedYears = liturgicalYears.reduce(
    (acc, year) => {
      if (!acc[year.name]) {
        acc[year.name] = [];
      }
      acc[year.name].push(year);
      return acc;
    },
    {} as Record<string, LiturgicalYearProps[]>
  );

  // Đóng dropdown khi click ra ngoài (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div>
      <header className="bg-[#7b1fa2] text-white text-center py-4 px-4">
        <h1 className="text-lg md:text-xl font-bold">GIÁO XỨ TÂN TRANG</h1>
        <p className="text-sm">Giáo phận Sài Gòn</p>
      </header>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center px-4 py-2 bg-white border-b">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          {isMobileMenuOpen ?
            <X size={24} />
          : <Menu size={24} />}
        </button>
        {/* Mobile Search */}
        <div className="relative flex-1 max-w-xs mx-4">
          <input
            type="text"
            placeholder="Tìm kiếm...."
            className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.313 0 6 2.687 6 6s-2.687 6-6 6-6-2.687-6-6 2.687-6 6-6z" />
          </svg>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-gray-200">
          <ul className="flex flex-col space-y-0 text-gray-700 font-semibold">
            <li>
              <Link
                href="/"
                className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tin tức chung
              </Link>
            </li>
            <li>
              <Link
                href="/tntt"
                className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Thiếu nhi Thánh Thể
              </Link>
            </li>
            <li>
              <Link
                href="/bible-readings"
                className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kinh thánh
              </Link>
            </li>
            {/* Accordion cho Năm phụng vụ trên mobile */}
            <li>
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                onClick={() => setIsMobileDropdownOpen((v) => !v)}
              >
                Năm phụng vụ{" "}
                <ChevronDown
                  className={`ml-2 transition-transform ${
                    isMobileDropdownOpen ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>
              {isMobileDropdownOpen && (
                <ul className="bg-gray-50">
                  {Object.entries(groupedYears).map(([yearName, seasons]) => (
                    <li key={yearName}>
                      <details>
                        <summary className="px-8 py-2 cursor-pointer hover:bg-blue-50">
                          {yearName}
                        </summary>
                        <ul>
                          {seasons.map((season) => (
                            <li key={season.id}>
                              <Link
                                href={`/liturgical-years/${season.id}`}
                                className="block px-12 py-2 text-sm hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {season.code}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/gioi-thieu"
                className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Giới Thiệu
              </Link>
            </li>
            <li>
              <Link
                href="/lien-he"
                className="block px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
      )}
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-grow justify-center mx-4">
        <ul className="flex space-x-6 text-gray-700 font-semibold p-2 items-center">
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
              href="/news"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <p>Tin tức chung</p>
            </Link>
          </li>
          <li>
            <Link
              href="/tntt"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <p>Thiếu nhi Thánh Thể</p>
            </Link>
          </li>
          <li>
            <Link
              href="/bible-readings"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <p>Kinh thánh</p>
            </Link>
          </li>
          {/* Dropdown Năm phụng vụ trên desktop */}
          <li className="relative">
            <div ref={dropdownRef}>
              <button
                className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                onClick={() => setIsDropdownOpen((v) => !v)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              >
                <span>Năm phụng vụ</span>
                <ChevronDown
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  {Object.entries(groupedYears).map(([yearName, seasons]) => (
                    <li key={yearName} className="relative group">
                      <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer">
                        {yearName}
                        <span>▶</span>
                      </div>
                      {/* Submenu */}
                      <ul className="absolute top-0 left-full ml-1 bg-white border rounded-lg shadow-lg py-1 w-56 hidden group-hover:block">
                        {seasons.map((season) => (
                          <li key={season.id}>
                            <Link
                              href={`/liturgical-years/${season.id}`}
                              className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {season.code}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
      {/* Desktop Search */}
      <div className="hidden md:block relative max-w-md mx-auto mt-4">
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
    </div>
  );
};

export default Navbar;
