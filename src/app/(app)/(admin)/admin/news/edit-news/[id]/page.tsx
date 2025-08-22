"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import RichText from "@/components/RichText";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  slug?: string;
  content: string;
  thumbnail?: string;
  categoryId: number;
  isFeatured?: boolean;
  createdAt: string;
  yearId: number;
}

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

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [yearName, setYearName] = useState<LiturgicalYear[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
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

  async function fetchNewsData() {
    try {
      const res = await axios.get(`http://localhost:3001/api/news/${newsId}`);
      const newsData: NewsItem = res.data;
      setTitle(newsData.title);
      setSlug(newsData.slug || "");
      setContent(newsData.content);
      setCurrentThumbnailUrl(newsData.thumbnail || "");
      setCategoryId(newsData.categoryId);
      setYearId(newsData.yearId);
      setIsFeatured(newsData.isFeatured || false);
    } catch (error) {
      console.error("Error fetching news data:", error);
      alert("Không thể tải dữ liệu tin tức!");
      router.push("/admin/news");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    const res = await axios.get(`http://localhost:3001/api/category`);
    setCategories(res.data);
  }

  async function fetchYear() {
    const res = await axios.get(`http://localhost:3001/api/year`);
    setYearName(res.data);
  }

  useEffect(() => {
    fetchCategories();
    fetchNewsData();
    fetchYear();
  }, [newsId]);

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

      // Upload new image if selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(
          "http://localhost:3001/api/news/upload",
          formData
        );
        thumbnailUrl = uploadRes.data.url;

        // Delete old image if there is one
        if (currentThumbnailUrl) {
          try {
            await axios.delete("http://loaclhost/api/news/delete-image", {
              data: { imageUrl: currentThumbnailUrl },
            });
          } catch (error) {
            console.error("Failed to delete image on server:", error);
          }
        }
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

      await axios.put(`http://localhost:3001/api/news/${newsId}`, payload);

      alert("Cập nhật tin tức thành công!");
      router.push("/admin/news");
    } catch (error) {
      console.error("Failed to edit news:", error);
      alert("Cập nhật tin tức thất bại!");
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm phụng vụ *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  {file ? "Thay đổi hình ảnh" : "Chọn hình ảnh mới"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {/* Hiển thị preview của file mới chọn */}
                {(file || currentThumbnailUrl) && (
                  <div className="relative">
                    <Image
                      src={
                        file ?
                          URL.createObjectURL(file)
                        : currentThumbnailUrl || ""
                      }
                      alt="Preview"
                      className="object-cover rounded border"
                      width={160}
                      height={160}
                      priority // Tải sớm ảnh preview
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      onClick={() => {
                        setFile(null);
                        if (!file) setCurrentThumbnailUrl("");
                      }}
                      title="Xóa hình ảnh hiện tại"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
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
                {isSubmitting ? "Đang cập nhật...." : "Cập nhật tin tức"}
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
    </div>
  );
}
