"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface TnttItems {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  categoryId: number;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminTnttPage() {
  const [tntt, setTntt] = useState<TnttItems[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  async function fetchTntt() {
    try {
      const res = await axios.get("http://localhost:3001/api/tntt");
      setTntt(res.data);
    } catch (err) {
      throw new Error("Failed to fetch TNTT list:");
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get("http://localhost:3001/api/category");
      setCategories(res.data);
    } catch (err) {
      throw new Error("Failed to fetch categories list:");
    }
  }

  useEffect(() => {
    fetchTntt();
    fetchCategories();
  }, []);

  async function handleAddOrUpdate() {
    try {
      let thumbnailUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(
          "http://localhost:3001/api/tntt/upload",
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
        description,
        thumbnail: thumbnailUrl || undefined,
        categoryId,
        isFeatured,
      };

      if (editingId !== null) {
        // Update existing TNTT
        await axios.put(`http://localhost:3001/api/tntt/${editingId}`, payload);
      } else {
        // Add TNTT
        await axios.post("http://localhost:3001/api/tntt", payload);
      }

      setTitle("");
      setSlug("");
      setDescription("");
      setFile(null);
      setCategoryId(null);
      setIsFeatured(false);
      setEditingId(null);
      fetchTntt();
    } catch (err) {
      console.error("Failed to save tntt:", err);
    }
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`http://localhost:3001/api/tntt/${id}`);
      fetchTntt();
    } catch (err) {
      console.error("Failed to delete tntt:", err);
    }
  }

  function startEdit(item: TnttItems) {
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description);
    setCategoryId(item.categoryId);
    setIsFeatured(!!item.isFeatured);
    setEditingId(item.id);
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
          Quản lý tin tức Thiếu Nhi Thánh Thể
        </h1>

        {/* Add TNTT Form */}
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
            <textarea
              rows={5}
              value={description}
              placeholder="Mô tả"
              onChange={(e) => setDescription(e.target.value)}
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
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Chọn hình ảnh
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {file && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="object-cover rounded border"
                  width={160}
                  height={160}
                />
              )}
            </div>
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
              className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90 transition"
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>

        {/* TNTT list */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách tin tức
          </h2>
          <ul className="space-y-4">
            {tntt.map((item) => (
              <li
                key={item.id}
                className="flex overflow-hidden bg-white rounded-lg shadow-md cursor-pointer"
                onClick={() => startEdit(item)}
              >
                {item.thumbnail && (
                  <img
                    src={`http://localhost:3001${item.thumbnail}`}
                    alt="Thumbnail"
                    className="w-40 h-28 object-cover"
                  />
                )}
                <div className="flex-1 p-4 flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1 w-196">
                      Mô tả: {item.description}
                    </p>
                    <span className="text-sm text-gray-500">
                      Slug: {item.slug}
                    </span>
                    {item.isFeatured && (
                      <p className="pl-6 text-xs text-red-500 font-bold">
                        ✨Bài viết nổi bật
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="bg-[#ff2525] text-white h-[100%] w-20 rounded cursor-pointer hover:opacity-79"
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
