"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import RichText from "@/components/RichText";

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

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [yearName, setYearName] = useState<LiturgicalYear[]>([]);
  const [yearId, setYearId] = useState<number | null>(null);

  async function fetchNews() {
    try {
      const response = await axios.get(
        // "https://tantrang-backend.onrender.com/api/news"
        "http://localhost:3001/api/news"
      );
      setNews(response.data);
    } catch (error) {
      console.error("Lỗi khi tải tin tức.", error);
      alert("Không thể tải danh sách tin tức. Vui lòng thử lại!!!");
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get(
        // "https://tantrang-backend.onrender.com/api/category"
        "http://localhost:3001/api/category"
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
        "http://localhost:3001/api/year"
      );
      setYearName(res.data);
    } catch (error) {
      console.error("Fetching Liturgical Year error:", error);
    }
  }

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchYear();
  }, []);

  async function handleAddOrUpdate() {
    try {
      let thumbnailUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(
          // "https://tantrang-backend.onrender.com/api/news/upload",
          "http://localhost:3001/api/news/upload",

          formData
        );

        thumbnailUrl = uploadRes.data.url; // /uploads/123456.jpeg
      }

      if (!categoryId) {
        alert("Vui lòng chọn danh mục");
        return;
      }

      const payload = {
        title,
        slug,
        content: content,
        thumbnail: thumbnailUrl || undefined,
        yearId,
        categoryId,
        isFeatured,
      };

      if (editingId !== null) {
        //Update existing news
        await axios.put(
          // `https://tantrang-backend.onrender.com/api/news/${editingId}`,
          `http://localhost:3001/api/news/${editingId}`,
          payload
        );
      } else {
        // Add news
        await axios.post(
          // "https://tantrang-backend.onrender.com/api/news",
          "http://localhost:3001/api/news",
          payload
        );
      }
      setTitle("");
      setSlug("");
      setContent("");
      setFile(null);
      setCategoryId(null);
      setIsFeatured(false);
      setEditingId(null);
      setCurrentThumbnailUrl(undefined);
      setYearId(null);
      fetchNews();
    } catch (error) {
      console.error("Failed to save news:", error);
    }
  }

  async function handleDelete(id: number, thumbnailUrl?: string) {
    // Xác nhận từ người dùng trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return;
    try {
      // 1. Gửi yêu cầu xóa tin tức từ database
      await axios.delete(
        // `https://tantrang-backend.onrender.com/api/news/${id}`
        `http://localhost:3001/api/news/${id}`
      );

      // 2. Nếu có hình, gửi yêu cầu xóa hình ảnh từ server
      if (thumbnailUrl) {
        try {
          // GỬi đường dẫn tương đối của ảnh để backend xóa
          const deleteImageRes = await axios.delete(
            // "https://tantrang-backend.onrender.com/api/news/delete-image",
            "http://localhost:3001/api/news/delete-image",
            {
              data: {
                imageUrl: thumbnailUrl, // Đây là nơi backend sẽ extract filename từ URL này
              },
            }
          );
          console.log("Image delete response:", deleteImageRes.data.message);
        } catch (imageDeleteError: any) {
          console.error("Failed to delete image on server: ", imageDeleteError);

          // Xử lý các loại bug khác nhau từ backend
          if (imageDeleteError.response?.status === 404) {
            console.warn(
              "Image file not found on server, but news was deleted successfully"
            );
          } else if (imageDeleteError.response?.status === 403) {
            console.error("Access denied when deleting image");
            alert("Không có quyền xóa ảnh, nhưng tin tức đã bị xóa");
          } else {
            alert("Xóa ảnh không thành công, nhưng tin tức đã bị xóa");
          }
          // Bạn có thể hiển thị thông báo lỗi cho người dùng
          // Vì tin tức chính đã bị xóa khỏi Database
          // alert("Xóa ảnh không thành công, nhưng tin tức đã bị xóa");
        }
      }

      fetchNews();
      alert("Tin tức đã được xóa thành công!");
    } catch (error: any) {
      console.error("Failed to delete news:", error);
      alert("Xóa tin tức thất bại. Vui lòng thử lại!");
    }
  }

  function startEdit(item: NewsItem) {
    setTitle(item.title);
    setSlug(item.slug || "");
    setContent(item.content);
    setCategoryId(item.categoryId);
    setIsFeatured(!!item.isFeatured);
    setEditingId(item.id);
    setYearId(item.yearId);
  }

  async function handleDeleteCurrentThumbnail() {
    if (!currentThumbnailUrl) return;

    if (!window.confirm("Bạn có chắc chắn muốn xóa hình ảnh hiện tại không?")) {
      return;
    }

    try {
      const deleteImageRes = await axios.delete(
        `http://localhost:3001/api/news/delete-image`,
        {
          data: {
            imageUrl: currentThumbnailUrl,
          },
        }
      );
      console.log("Current thumbnail deleted:", deleteImageRes.data.message);
      // Cập nhật state news để loại bỏ thumbnail khỏi item đang chỉnh sửa
      setNews((prevNews) =>
        prevNews.map((n) =>
          n.id === editingId ? { ...n, thumbnail: undefined } : n
        )
      );
      setCurrentThumbnailUrl(undefined); // Xóa URL thumbnail hiện tại khỏi state
      setFile(null);
      alert("Ảnh hiện tại đã được xóa khỏi Database");
    } catch (err: any) {
      console.error("Lỗi khi xóa ảnh hiện tại:", err);
      alert(
        ` Lỗi khi xóa ảnh hiện tại: ${err.response?.data?.error || err.message}`
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
          Quản lý tin tức
        </h1>

        {/* Add News Form */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-medium mb-4 text-[#2d27ff]">
            {editingId ? "Chỉnh sửa tin tức" : "Thêm mới tin tức"}
          </h2>
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              value={title}
              placeholder="Tiêu đề"
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              value={slug}
              placeholder="Slug"
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded p-2"
            />
            <p className="text-base text-gray-800 font-bold">
              Nội dung của tin tức (Mô tả)
            </p>
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
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="object-cover rounded border"
                  width={160}
                  height={160}
                  priority // Tải sớm ảnh preview
                />
              )}

              {/* Hiển thị hình ảnh hiện tại khi chỉnh sửa và chưa chọn file mới */}
              {editingId && !file && currentThumbnailUrl && (
                <div className="relative">
                  <Image
                    src={currentThumbnailUrl}
                    alt="Preview"
                    className="object-cover rounded border"
                    width={160}
                    height={160}
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold cursor-pointer"
                    onClick={handleDeleteCurrentThumbnail}
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
            <button
              onClick={handleAddOrUpdate}
              className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>

        {/* News List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách tin tức
          </h2>
          <ul className="space-y-4">
            {news.map((item) => (
              <li
                key={item.id}
                className="flex overflow-hidden bg-white rounded-lg shadow-sm cursor-pointer"
                onClick={() => startEdit(item)}
              >
                {item.thumbnail && (
                  <img
                    // src={`https://tantrang-backend.onrender.com${item.thumbnail}`}
                    src={item.thumbnail}
                    alt="Thumbnail"
                    className="w-40 h-28 object-cover"
                  />
                )}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1 w-196">
                      Mô tả: {item.content}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">
                      Năm Phụng Vụ: {item.yearId}
                    </span>
                    {item.isFeatured && (
                      <span className="pl-6 text-xs text-red-500 font-bold">
                        ✨ Bài viết nổi bật
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {/* <button
                    className="text-[#0014ff] hover:underline cursor-pointer"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button> */}
                  <button
                    className="bg-[#ff2525] text-white h-[100%] w-20 rounded cursor-pointer hover:opacity-70"
                    onClick={() => handleDelete(item.id, item.thumbnail)}
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
