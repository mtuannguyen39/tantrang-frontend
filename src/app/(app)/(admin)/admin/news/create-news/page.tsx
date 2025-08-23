"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import RichText from "@/components/RichText";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface LiturgicalYear {
  id: number;
  title: string;
  name: string;
  code: string;
  year: number;
}

export default function CreateNewsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [yearName, setYearName] = useState<LiturgicalYear[]>([]);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<
    string | undefined
  >(undefined);
  const [yearId, setYearId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchCategories() {
    try {
      const res = await axios.get(
        // "https://tantrang-backend.onrender.com/api/category"
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Fetching categories error:", error);
    }
  }

  async function fetchYear() {
    try {
      const res = await axios.get(
        // "https://tantrang-backend.onrender.com/api/category"
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/year`
      );
      setYearName(res.data);
    } catch (error) {
      console.error("Fetching Liturgical Year error:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchYear();
  }, []);

  async function handleSubmit() {
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề!");
      return;
    }

    if (!content.trim()) {
      alert("Vui lòng nhập nội dung!");
      return;
    }

    if (!categoryId) {
      alert("Vui lòng chọn danh mục!");
      return;
    }

    setIsSubmitting(true);

    try {
      let thumbnailUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news/upload`,
          formData
        );
        thumbnailUrl = uploadRes.data.url;
      }

      const payload = {
        title,
        slug: slug || undefined,
        content: content,
        thumbnail: thumbnailUrl || undefined,
        yearId,
        categoryId,
        isFeatured,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news`,
        payload
      );

      alert("Tạo tin tức thành công!");
      router.push("/admin/news");
    } catch (error) {
      console.error("Failed to create news:", error);
      alert("Tạo tin tức thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setSlug("");
    setContent("");
    setFile(null);
    setCategoryId(null);
    setIsFeatured(false);
    setEditingId(null);
    setCurrentThumbnailUrl(undefined);
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
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

        {/* Add News Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col space-y-4">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              placeholder="Tiêu đề"
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2"
              required
            />
            <label className="block text-base font-medium text-gray-700 mb-2">
              Slug (có thể có hoặc không)
            </label>
            <input
              type="text"
              value={slug}
              placeholder="Slug"
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded p-2"
            />
            <label className="block text-base font-medium text-gray-700 mb-2">
              Nội dung của tin tức (Mô tả)
            </label>
            <RichText
              value={content}
              onChange={setContent}
              placeholder="Mô tả"
              className="min-h-[150px]"
            />
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
            <select
              className="border p-2 rounded"
              value={yearId ?? ""}
              onChange={(e) => setYearId(Number(e.target.value))}
            >
              <option value="" disabled>
                Chọn năm phụng vụ
              </option>
              {yearName.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} - {y.code} - {y.year}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Chọn hình ảnh
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setCurrentThumbnailUrl(undefined); // Xóa URL thumbnail hiện tại khi chọn file mới
                    }
                  }}
                />
              </label>
              {/* Hiển thị preview của file mới chọn */}
              {file && (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="object-cover rounded border"
                    width={160}
                    height={160}
                    priority // Tải sớm ảnh preview
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    onClick={() => setFile(null)}
                    title="Xóa hình ảnh hiện tại"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                disabled
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span>Đánh dấu bài viết nổi bật</span>
            </div>
            <div className="flex justify-center items-center gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] px-6 py-3 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Đang tạo...." : "Tạo tin tức mới"}
              </button>
              <button
                onClick={resetForm}
                type="button"
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
