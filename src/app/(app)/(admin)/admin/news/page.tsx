"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news`
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
    fetchNews();
    fetchCategories();
    fetchYear();
  }, []);

  async function handleDelete(id: number, thumbnailUrl?: string) {
    // Xác nhận từ người dùng trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return;
    try {
      // 1. Gửi yêu cầu xóa tin tức từ database
      await axios.delete(
        // `https://tantrang-backend.onrender.com/api/news/${id}`
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news/${id}`
      );

      // 2. Nếu có hình, gửi yêu cầu xóa hình ảnh từ server
      if (thumbnailUrl) {
        try {
          // GỬi đường dẫn tương đối của ảnh để backend xóa
          const deleteImageRes = await axios.delete(
            // "https://tantrang-backend.onrender.com/api/news/delete-image",
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/news/delete-image`,
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

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Quản lý tin tức
          </h1>
          <div>
            <button className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <Link href={`/admin/news/create-news`}>Tạo mới tin tức</Link>
            </button>
          </div>
        </div>
        {/* News List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách tin tức ({news.length})
          </h2>

          {news.length === 0 ?
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">Chưa có tin tức nào</p>
              <Link
                href="/admin/news/create-news"
                className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded hover:opacity-90"
              >
                Tạo tin tức đầu tiên
              </Link>
            </div>
          : <ul className="space-y-4">
              {news.map((item) => (
                <li
                  key={item.id}
                  className="flex overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {item.thumbnail && (
                    <img
                      // src={`https://tantrang-backend.onrender.com${item.thumbnail}`}
                      src={item.thumbnail}
                      alt="Thumbnail"
                      className="w-56 h-full object-cover py-8 px-2"
                    />
                  )}
                  <div className="flex-1 p-4 flex flex-col justify-center items-center">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                        ...
                      </p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>Năm Phụng Vụ: {item.yearId}</span>
                        <span>Danh mục: {item.categoryId}</span>
                        <span>
                          Ngày tạo:{" "}
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {item.isFeatured && (
                        <span className="inline-block mt-2 text-xs text-red-500 font-bold">
                          ✨ Bài viết nổi bật
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-4 space-y-2">
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/admin/news/edit-news/${item.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.thumbnail);
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
