"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  getAllYear,
  getAllCategories,
  saveYear,
  deleteYear,
  deleteCurrentImage,
} from "@/modules/liturgical-year/server/procedures";

interface YearItem {
  id: number;
  name: string;
  code: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  categoryId: number;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminYearPage() {
  const [liturYear, setLiturYear] = useState<YearItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<
    string | undefined
  >(undefined);

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

  async function handleAddOrUpdate() {
    try {
      if (!categoryId) {
        alert("Vui lòng chọn danh mục");
        return;
      }

      const payload: Omit<YearItem, "id"> = {
        title,
        description,
        code,
        name,
        year: year ?? 0,
        imageUrl: currentThumbnailUrl,
        isFeatured,
        categoryId,
      };

      await saveYear(payload, file, editingId);

      setTitle("");
      setDescription("");
      setCode("");
      setName("");
      setYear(null);
      setFile(null);
      setIsFeatured(false);
      setEditingId(null);
      setCategoryId(null);
      setCurrentThumbnailUrl(undefined);
      fetchYearData();
    } catch (error) {
      console.error("Lỗi khi lưu tin tức năm phụng vụ:", error);
      alert("Lưu tin tức thất bại. Vui lòng thử lại!");
    }
  }

  function startEdit(item: YearItem) {
    setTitle(item.title);
    setDescription(item.description);
    setCode(item.code);
    setName(item.name);
    setYear(item.year);
    setFile(null);
    setIsFeatured(item.isFeatured ?? false);
    setCategoryId(item.categoryId);
    setEditingId(item.id);
    setCurrentThumbnailUrl(item.imageUrl);
  }

  // async function handleDeleteCurrentImageFromUI() {
  //   if (!currentThumbnailUrl) return;

  //   try {
  //     await deleteCurrentImage(currentThumbnailUrl);
  //     setLiturYear((prevYears) =>
  //       prevYears.map((y) =>
  //         y.id === editingId ? { ...y, imageUrl: undefined } : y
  //       )
  //     );
  //     setCurrentThumbnailUrl(undefined);
  //     setFile(null);
  //   } catch (error: any) {
  //     alert(error.message);
  //   }
  // }

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
          Quản lý tin tức năm phụng vụ
        </h1>

        {/* Thêm mới tin tức năm phụng vụ */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-medium mb-4 text-[#2d27ff]">
            {editingId ? "Chỉnh sửa tin tức" : "Thêm mới tin tức"}
          </h2>
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              value={title}
              placeholder="Mùa Phục Sinh năm A 2025"
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="text"
              value={name}
              placeholder="Năm A - 2025"
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              value={code}
              placeholder="Mùa phụng vụ - Ví dụ Mùa Vọng / Mùa Giáng Sinh / Mùa Thường niên ..."
              onChange={(e) => setCode(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="number"
              value={year ?? ""}
              placeholder="Năm phụng vụ - Ví dụ: 2025"
              className="border rounded p-2"
              onChange={(e) => setYear(Number(e.target.value))}
              required
            />
            {/* <input
              type="text"
              value={title}
              placeholder="Tiêu đề"
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2"
            /> */}
            <select
              className="border p-2 rounded"
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

            <button
              onClick={handleAddOrUpdate}
              className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>

        {/* Danh sách năm phụng vụ */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách năm phụng vụ
          </h2>
          <ul className="space-y-4">
            {liturYear.map((item) => (
              <li
                key={item.id}
                className="flex overflow-hidden bg-white rounded-lg shadow-sm cursor-pointer"
                onClick={() => startEdit(item)}
              >
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h1 className="text-lg font-bold">Tiêu đề: {item.title}</h1>
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
                <div className="flex justify-end space-x-3">
                  <button
                    className="bg-[#ff2525] text-white h-[100%] w-20 rounded cursor-pointer hover:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteYear(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
