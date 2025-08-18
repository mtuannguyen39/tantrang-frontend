"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  SearchIcon,
  Home,
  Newspaper,
  Users,
  Book,
  Calendar,
  Info,
  Phone,
} from "lucide-react";
import axios from "axios";
import { Search } from "@/components/search-params";

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
    <div className="top-0 z-50 backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20">
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent tracking-wide mb-2">
              GIÁO XỨ TÂN TRANG
            </h1>
            <p className="text-blue-100/90 text-sm md:text-base font-medium tracking-wider">
              Giáo phận Sài Gòn
            </p>
          </div>
        </div>
      </header>

      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18">
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium group"
              >
                <Home
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Trang chủ</span>
              </Link>
              <Link
                href="/news"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium group"
              >
                <Newspaper
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Tin tức</span>
              </Link>
              <Link
                href="/tntt"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium group"
              >
                <Users
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>TNTT</span>
              </Link>
              <Link
                href="/bible-readings"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium group"
              >
                <Book
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Kinh thánh</span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium focus:outline-none group"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Calendar
                    size={18}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span>Năm phụng vụ</span>
                  <ChevronDown
                    className={`transition-all duration-300 group-hover:scale-110 ${isDropdownOpen ? "rotate-180" : ""}`}
                    size={16}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 w-80 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="py-2">
                      {Object.entries(groupedYears).map(
                        ([yearName, seasons]) => (
                          <div key={yearName} className="group">
                            <div className="px-6 py-3 text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-gray-100/50">
                              {yearName}
                            </div>
                            <div className="py-1">
                              {seasons.map((season) => (
                                <Link
                                  key={season.id}
                                  href={`/liturgical-years/${season.id}`}
                                  className="block px-6 py-3 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 hover:translate-x-1"
                                  onClick={() => setIsDropdownOpen(false)}
                                >
                                  {season.code}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/gioi-thieu"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium group"
              >
                <Info
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Giới thiệu</span>
              </Link>
              <Link
                href="/lien-he"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 font-medium group"
              >
                <Phone
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Liên hệ</span>
              </Link>
            </div>

            <div className="hidden lg:block flex-1 max-w-md ml-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                  <Search />
                </div>
              </div>
            </div>

            <div className="lg:hidden flex items-center space-x-4 w-full">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300"
              >
                {isMobileMenuOpen ?
                  <X size={24} />
                : <Menu size={24} />}
              </button>

              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                    <Search />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="py-4 space-y-1">
              <Link
                href="/"
                className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-medium">Trang chủ</span>
              </Link>
              <Link
                href="/news"
                className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Newspaper
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-medium">Tin tức</span>
              </Link>
              <Link
                href="/tntt"
                className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-medium">Thiếu nhi Thánh Thể</span>
              </Link>
              <Link
                href="/bible-readings"
                className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Book
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-medium">Kinh thánh</span>
              </Link>

              <div>
                <button
                  className="w-full flex items-center justify-between mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 focus:outline-none group"
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar
                      size={20}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="font-medium">Năm phụng vụ</span>
                  </div>
                  <ChevronDown
                    className={`transition-all duration-300 group-hover:scale-110 ${isMobileDropdownOpen ? "rotate-180" : ""}`}
                    size={18}
                  />
                </button>

                {isMobileDropdownOpen && (
                  <div className="mx-4 mt-2 bg-gray-50/80 backdrop-blur-sm rounded-xl overflow-hidden">
                    {Object.entries(groupedYears).map(([yearName, seasons]) => (
                      <div key={yearName}>
                        <div className="px-8 py-3 text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-gray-100/50">
                          {yearName}
                        </div>
                        {seasons.map((season) => (
                          <Link
                            key={season.id}
                            href={`/liturgical-years/${season.id}`}
                            className="block px-12 py-3 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 hover:translate-x-1"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {season.code}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/gioi-thieu"
                className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-medium">Giới thiệu</span>
              </Link>
              <Link
                href="/lien-he"
                className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-medium">Liên hệ</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
