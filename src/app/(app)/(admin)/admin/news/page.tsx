"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  categoryId: number;
  isFeatured?: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
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

  async function fetchNews() {
    try {
      const response = await axios.get("http://localhost:3001/api/news");
      setNews(response.data);
    } catch (error) {
      console.error("Fetching news error:", error);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get("http://localhost:3001/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Fetching categories error:", error);
    }
  }

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  async function handleAddOrUpdate() {
    try {
      let thumbnailUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(
          "http://localhost:3001/api/news/upload",
          formData
        );

        thumbnailUrl = uploadRes.data.url;
      }

      if (!categoryId) {
        alert("Vui lòng chọn danh mục");
        return;
      }

      const payload = {
        title,
        slug,
        content,
        thumbnail: thumbnailUrl || undefined,
        categoryId,
        isFeatured,
      };

      if (editingId !== null) {
        //Update existing news
        await axios.put(`http://localhost:3001/api/news/${editingId}`, payload);
      } else {
        // Add news
        await axios.post("http://localhost:3001/api/news", payload);
      }
      setTitle("");
      setSlug("");
      setContent("");
      setFile(null);
      setCategoryId(null);
      setIsFeatured(false);
      setEditingId(null);
      fetchNews();
    } catch (error) {
      console.error("Failed to save news:", error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`http://localhost:3001/api/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error("Failed to delete news:", error);
    }
  }

  function startEdit(item: NewsItem) {
    setTitle(item.title);
    setSlug(item.slug);
    setContent(item.content);
    setCategoryId(item.categoryId);
    setIsFeatured(!!item.isFeatured);
    setEditingId(item.id);
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
              required
            />
            <textarea
              rows={3}
              value={content}
              placeholder="Mô tả"
              onChange={(e) => setContent(e.target.value)}
              className="border rounded p-2"
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
            <input
              type="file"
              className="border rounded p-2"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <div className="flex gap-4">
              <input
                type="checkbox"
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
                    src={`http://localhost:3001${item.thumbnail}`}
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
                      Slug: {item.slug}
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
                    onClick={() => handleDelete(item.id)}
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
