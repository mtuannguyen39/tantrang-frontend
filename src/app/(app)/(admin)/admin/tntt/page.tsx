"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import RichText from "@/components/RichText";
import Link from "next/link";

interface TnttItems {
  id: number;
  title: string;
  slug?: string;
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
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<
    string | undefined
  >(undefined);

  async function fetchTntt() {
    try {
      const res = await axios.get(
        // "https://tantrang-backend.onrender.com/api/tntt",
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tntt`
      );
      setTntt(res.data);
    } catch (err) {
      console.log("Lỗi khi tải danh sách tin tức TNTT", err);
      alert("Không thể tải danh sách tin tức TNTT. Vui lòng thử lại!!!");
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get(
        // "https://tantrang-backend.onrender.com/api/category",
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`
      );
      setCategories(res.data);
    } catch (err) {
      throw new Error("Failed to fetch categories list:");
    }
  }

  useEffect(() => {
    fetchTntt();
    fetchCategories();
  }, []);

  async function handleDelete(id: number, thumbnailUrl?: string) {
    // Xác nhận từ người dùng trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return;
    try {
      // 1. Gửi yêu cầu xóa tin tức từ database
      await axios.delete(
        // `https://tantrang-backend.onrender.com/api/tntt/${id}`
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tntt/${id}`
      );

      // 2. Nếu có hình, gửi yêu cầu xóa hình ảnh từ server
      if (thumbnailUrl) {
        try {
          // Gửi đường dẫn tương đối của ảnh để backend xóa
          const deleteImageRes = await axios.delete(
            // "https://tantrang-backend.onrender.com/api/tntt/delete-image",
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tntt/delete-image`,
            {
              data: {
                imageUrl: thumbnailUrl, // Đây là nơi backend sẽ extrach filename từ URL này
              },
            }
          );
          console.log("Image delete response: ", deleteImageRes.data.message);
        } catch (imageDeleteError: any) {
          console.error("Failed to delete image on server:", imageDeleteError);

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
      fetchTntt();
      alert("Tin tức đã được xóa thành công!");
    } catch (err: any) {
      console.error("Failed to delete tntt:", err);
      alert("Xóa tin tức thất bại. Vui lòng thử lại!");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Quản lý tin tức Thiếu Nhi Thánh Thể
          </h1>
          <div>
            <button className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded-lg hover:opactity-90 transition-opacity">
              <Link href={`/admin/tntt/create-news`}>Tạo mới tin tức TNTT</Link>
            </button>
          </div>
        </div>

        {/* TNTT list */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Danh sách tin tức của Thiếu Nhi Thánh Thể ({tntt.length})
          </h2>

          {tntt.length === 0 ?
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">Chưa có tin tức nào</p>
              <Link
                href="/admin/tntt/create-news"
                className="bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-white px-4 py-2 rounded hover:opacity-90"
              >
                Tạo tin tức của Thiếu Nhi Thánh Thể đầu tiền
              </Link>
            </div>
          : <ul className="space-y-4">
              {tntt.map((item) => (
                <li
                  key={item.id}
                  className="flex overflow-hidden bg-white rounded-lg shadow-md hover:shadow-md transition-shadow"
                >
                  {item.thumbnail && (
                    <img
                      // src={`https://tantrang-backend.onrender.com${item.thumbnail}`}
                      src={item.thumbnail}
                      alt="Thumbnail"
                      className="w-56 h-full object-cover py-8 px-2"
                    />
                  )}
                  <div className="flex-1 p-4 flex-col justify-center items-center">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.description
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 150)}
                        ...
                      </p>
                      <div>
                        <span className="flex gap-4 text-xs text-gray-500">
                          Slug: {item.slug}
                        </span>
                        <span>
                          Ngày tạo:{" "}
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {item.isFeatured && (
                        <p className="pl-6 text-xs text-red-500 font-bold">
                          ✨Bài viết nổi bật
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-4 space-y-2">
                    <Link
                      href={`/admin/tntt/${item.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/admin/tntt/edit-news/${item.id}`}
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
