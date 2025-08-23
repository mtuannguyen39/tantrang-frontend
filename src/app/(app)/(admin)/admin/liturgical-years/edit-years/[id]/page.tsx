"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

export default function EditYearsPage() {
  const router = useRouter();
  const params = useParams();
  const yearsId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [yearName, setYearName] = useState<YearProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [years, setYears] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchYearsData() {
    try {
      const res = await axios.get(`http://localhost:3001/api/year/${yearsId}`);
      const yearsData: YearProps = res.data;
      setTitle(yearsData.title);
      setName(yearsData.name || "");
      setCode(yearsData.code);
      setCategoryId(yearsData.categoryId);
      setYears(yearsData.year);
    } catch (error) {
      console.error("Error fetching news data:", error);
      alert("Không thể tải dữ liệu tin tức!");
      router.push("/admin/liturgical-years");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    const res = await axios.get(`http://localhost:3001/api/category`);
    setCategories(res.data);
  }

  useEffect(() => {
    fetchCategories();
    fetchYearsData();
  }, [yearsId]);

  async function handleSubmit() {
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề!");
      return;
    }

    if (!name.trim()) {
      alert("Vui lòng nhập nội dung!");
      return;
    }

    if (!code.trim()) {
      alert("Vui lòng nhập nội dung!");
      return;
    }

    if (!years) {
      alert("Vui lòng nhập nội dung!");
      return;
    }

    if (!categoryId) {
      alert("Vui lòng chọn danh mục!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        name,
        code,
        years,
        categoryId,
      };

      await axios.put(`http://localhost:3001/api/years/${yearsId}`, payload);

      alert("Cập nhật năm phụng vụ thành công!");
      router.push("/admin/liturgical-years");
    } catch (error) {
      console.error("Failed to edit years:", error);
      alert("Cập nhật năm phụng vụ thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f9f9ff] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <div className="flex-1 p-6">
        <div className="relative flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex gap-2 justify-start bg-white text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft />
            Quay lại
          </button>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text">
            Tạo tin tức mới
          </h1>
        </div>

        {/* Edit News Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col space-y-4">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              placeholder="Mùa Phục Sinh năm A 2025"
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2"
              required
            />
            <label className="block text-base font-medium text-gray-700 mb-2">
              Năm phụng vụ
            </label>
            <input
              type="text"
              value={name}
              placeholder="Năm A - 2025"
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2"
            />
            <label className="block text-base font-medium text-gray-700 mb-2">
              Mùa phụng vụ
            </label>
            <input
              type="text"
              value={code}
              placeholder="Mùa phụng vụ - Ví dụ Mùa Vọng / Mùa Giáng Sinh / Mùa Thường niên ..."
              onChange={(e) => setCode(e.target.value)}
              className="border rounded p-2"
              required
            />
            <label className="block text-base font-medium text-gray-700 mb-2">
              Mùa phụng vụ
            </label>
            <input
              type="number"
              value={years ?? ""}
              placeholder="Năm phụng vụ - Ví dụ: 2025"
              onChange={(e) => setYears(Number(e.target.value))}
              className="border rounded p-2"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={categoryId ?? ""}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Chọn danh mục
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] px-6 py-3 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Đang cập nhật...." : "Cập nhật Năm phụng vụ"}
            </button>
            <button
              onClick={() => router.back()}
              type="button"
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
