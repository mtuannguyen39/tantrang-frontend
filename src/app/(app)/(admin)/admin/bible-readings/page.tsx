"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  getAllReading,
  getAllCategories,
  getAllLiturgicalYear,
  saveReading,
  deleteReading,
  deleteCurrentImage,
} from "@/modules/bible-reading/server/procedures";

import RichText from "@/components/RichText";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface BibleReading {
  id: number;
  title: string;
  slug: string;
  scripture: string;
  reading1?: string;
  reading2?: string;
  psalm?: string;
  alleluia?: string;
  gospel: string;
  thumbnail?: string;
  liturgicalYearId: number;
  categoryId: number;
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
}

// Utility function để convert markdown sang HTML
function markdownToHtml(markdown: string): string {
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")

      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Underline (custom syntax)
      .replace(/__(.*?)__/g, "<u>$1</u>")

      // Superscript (custom syntax)
      .replace(/\^(.*?)\^/g, "<sup>$1</sup>")

      // Line breaks
      .replace(/\n/g, "<br>")
  );
}

export default function AdminReadingPage() {
  const [readings, setReadings] = useState<BibleReading[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [liturgicalYears, setLiturgicalYears] = useState<LiturgicalYear[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [scripture, setScripture] = useState("");
  const [reading1, setReading1] = useState("");
  const [reading2, setReading2] = useState("");
  const [psalm, setPsalm] = useState("");
  const [alleluia, setAlleluia] = useState("");
  const [gospel, setGospel] = useState("");
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<
    string | undefined
  >(undefined);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [liturgicalYearId, setLiturgicalYearId] = useState<number | null>(null);

  async function fetchReadingData() {
    try {
      const readingData = await getAllReading();
      setReadings(readingData);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function fetchCategoriesData() {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function fetchLiturgicalYearData() {
    try {
      const liturgicalYearData = await getAllLiturgicalYear();
      setLiturgicalYears(liturgicalYearData);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchReadingData();
      await fetchCategoriesData();
      await fetchLiturgicalYearData();
    };
    loadData();
  }, []);

  async function handleDelete(id: number, thumbnailUrl?: string) {
    // Xác nhận từ người dùng trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return;
    try {
      // 1. Gửi yêu cầu xóa tin tức từ database
      await axios.delete(
        // `https://tantrang-backend.onrender.com/api/news/${id}`
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reading/${id}`
      );

      // 2. Nếu có hình, gửi yêu cầu xóa hình ảnh từ server
      if (thumbnailUrl) {
        try {
          // GỬi đường dẫn tương đối của ảnh để backend xóa
          const deleteImageRes = await axios.delete(
            // "https://tantrang-backend.onrender.com/api/news/delete-image",
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reading/delete-image`,
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

      fetchReadingData();
      alert("Tin tức đã được xóa thành công!");
    } catch (error: any) {
      console.error("Failed to delete news:", error);
      alert("Xóa tin tức thất bại. Vui lòng thử lại!");
    }
  }

  return (
    <div className="flex min-h-screen max-w-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Quản lý các sách Kinh Thánh
          </h1>
          <Link
            href="/admin/bible-readings/create-readings"
            className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded-lg hover:opacity-50 transition-opacity"
          >
            Tạo mới tin tức
          </Link>
        </div>

        {/* Danh sách hiển thị Kinh Thánh */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách các sách Kinh Thánh ({readings.length})
          </h2>

          {readings.length === 0 ?
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">Chưa có lịch phụng vụ nào</p>
              <Link
                href="/admin/news/create-news"
                className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded hover:opacity-90"
              >
                Tạo lịch phụng vụ đầu tiên
              </Link>
            </div>
          : <ul className="space-y-4">
              {readings.map((reading) => (
                <li
                  key={reading.id}
                  className="flex overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {reading.thumbnail && (
                    <Image
                      src={reading.thumbnail}
                      alt={reading.title}
                      className="w-56 h-full object-cover py-8 px-2"
                    />
                  )}
                  <div className="flex-1 p-4 flex flex-col justify-center items-center">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        {reading.title}
                      </h3>
                      <span className="text-xs text-gray-400 mt-1">
                        Năm Phụng Vụ: {reading.liturgicalYearId} - Danh mục:{" "}
                        {reading.categoryId}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-4 space-y-2">
                    <Link
                      href={`/admin/bible-readings/${reading.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/admin/bible-readings/edit-readings/${reading.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(reading.id, reading.thumbnail);
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
