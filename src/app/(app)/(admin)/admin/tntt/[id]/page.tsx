"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface TnttProps {
  id: number;
  title: string;
  slug?: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  categoryId: number;
  category?: Category;
  isFeatured?: boolean;
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\^(.*?)\^/g, "<sup>$1</sup>") // Đặt lên đầu
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\n/g, "<br>");
}

export default function TnttDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const tnttId = params.id as string;

  const [tntt, setTntt] = useState<TnttProps | null>(null);
  const [htmlDescription, setHtmlDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function fetchTnttDetail(id: number) {
    try {
      const response = await axios.get(`http://localhost:3001/api/tntt/${id}`);
      setTntt(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching news detail:", error);
      alert("Không thể tải chi tiết tin tức!");
      router.push("/admin/tntt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!tnttId) return;

    const loadData = async () => {
      const data = await fetchTnttDetail(id);
      if (data && data.description) {
        const htmlDataDescription = markdownToHtml(data.description);
        setHtmlDescription(htmlDataDescription);
      }
    };

    loadData();
  }, [id]);

  async function handleDelete() {
    if (
      !tntt ||
      !window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")
    )
      return;

    try {
      await axios.delete(`http://localhost:3001/api/news/${tnttId}`);

      if (tntt.thumbnail) {
        try {
          await axios.delete("http://localhost:3001/api/news/delete-image", {
            data: { imageUrl: tntt.thumbnail },
          });
        } catch (imageDeleteError) {
          console.error("Failed to delete image:", imageDeleteError);
        }
      }

      alert("Tin tức đã được xóa thành công!");
      router.push("/admin/news");
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert("Xóa tin tức thất bại. Vui lòng thử lại!");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f9f9ff] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!tntt) {
    return (
      <div className="flex min-h-screen bg-[#f9f9ff] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy tin tức!</p>
          <Link
            href="/admin/news"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9ff]">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#ff2cdf] to-[#0014ff] text-transparent bg-clip-text inline-block">
            Chi tiết tin tức
          </h1>
          <div className="flex gap-2">
            <Link
              href={`/admin/tntt/edit/${tnttId}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              Chỉnh sửa
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              Xóa
            </button>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              ← Quay lại
            </button>
          </div>
        </div>

        {/* News Detail Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header with thumbnail */}
          {tntt.thumbnail && (
            <div className="relative h-64 md:h-80">
              <Image
                src={tntt.thumbnail || "/placeholder.svg"}
                alt={tntt.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-6">
            {/* Title and metadata */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {tntt.isFeatured && (
                  <span className="inline-block px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                    ✨ Nổi bật
                  </span>
                )}
                <span className="text-sm text-gray-500">ID: {tntt.id}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {tntt.title}
              </h1>

              {tntt.slug && (
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Slug:</strong> {tntt.slug}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>
                  <strong>Danh mục:</strong>{" "}
                  {tntt.category?.name || `ID: ${tntt.categoryId}`}
                </span>
                <span>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(tntt.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nội dung:
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: htmlDescription || "Không có nội dung ",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
