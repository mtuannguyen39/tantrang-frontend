"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  getAllYear,
  getAllCategories,
  saveYear,
  deleteYear,
} from "@/modules/liturgical-year/server/procedures";
import Link from "next/link";

interface YearProps {
  id: number;
  name: string;
  code: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  categoryId: number;
  category?: Category;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminYearPage() {
  const [liturYear, setLiturYear] = useState<YearProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchYearData() {
    try {
      const yearsData = await getAllYear();
      setLiturYear(yearsData);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function fetchCategoriesData() {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchYearData();
    fetchCategoriesData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Quản lý tin tức năm phụng vụ
          </h1>
          <div>
            <Link
              href={`/admin/liturgical-years/create-years`}
              className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded-lg hover:opactity-90 transition-opacity"
            >
              Tạo mới tin tức
            </Link>
          </div>
        </div>

        {/* Danh sách năm phụng vụ */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách năm phụng vụ ({liturYear.length})
          </h2>

          {liturYear.length === 0 ?
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">Chưa có tin tức nào</p>
              <Link
                href="/admin/liturgical-years/create-years"
                className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded-lg hover:opactity-90 transition-opacity"
              >
                Tạo năm phụng vụ đầu tiên
              </Link>
            </div>
          : <ul className="space-y-4">
              {liturYear.map((item) => (
                <li
                  key={item.id}
                  className="flex overflow-hidden bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-1 p-4 flex flex-col justify-center items-center">
                    <div>
                      <h1 className="text-lg font-bold">
                        Tiêu đề: {item.title}
                      </h1>
                      <h3 className="text-base font-medium">
                        Năm phụng vụ: {item.name}
                      </h3>
                      <p className="text-base font-medium line-clamp-1 w-196">
                        Mùa phụng vụ: {item.code}
                      </p>
                      <p className="text-base font-medium line-clamp-1 w-196">
                        Năm: {item.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-4 space-y-2">
                    <Link
                      href={`/admin/liturgical-years/${item.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/admin/liturgical-years/edit-years/${item.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:red-600 transition-color"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteYear(item.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      </main>
    </div>
  );
}
