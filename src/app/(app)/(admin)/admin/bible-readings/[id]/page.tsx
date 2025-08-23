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

interface ReadingProps {
  id: number;
  title: string;
  reading1?: string;
  reading2?: string;
  psalm?: string;
  alleluia?: string;
  gospel: string;
  scripture: string;
  category?: Category;
  thumbnail?: string;
  categoryId: number;
}

interface YearProps {
  id: number;
  name: string;
  code: string;
  year: string;
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

export default function YearsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const readingsId = params.id as string;

  const [readings, setReadings] = useState<ReadingProps | null>(null);
  const [htmlReading1, setHtmlReading1] = useState<string>("");
  const [htmlReading2, setHtmlReading2] = useState<string>("");
  const [htmlPsalm, setHtmlPsalm] = useState<string>("");
  const [htmlAlleluia, setHtmlAlleluia] = useState<string>("");
  const [htmlGospel, setHtmlGospel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function fetchNewsDetail(id: number) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reading/${id}`
      );
      setReadings(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching news detail:", error);
      alert("Không thể tải chi tiết tin tức!");
      router.push("/admin/bible-readings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!readingsId) return;

    const loadData = async () => {
      const data = await fetchNewsDetail(id);
      if (data) {
        if (data.reading1) setHtmlReading1(markdownToHtml(data.reading1));
        if (data.reading2) setHtmlReading2(markdownToHtml(data.reading2));
        if (data.psalm) setHtmlPsalm(markdownToHtml(data.psalm));
        if (data.alleluia) setHtmlAlleluia(markdownToHtml(data.alleluia));
        if (data.gospel) setHtmlGospel(markdownToHtml(data.gospel));
      }
    };

    loadData();
  }, [id]);

  async function handleDelete() {
    if (
      !readings ||
      !window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")
    )
      return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reading/${readingsId}`
      );

      if (readings.thumbnail) {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reading/delete-image`,
            {
              data: { imageUrl: readings.thumbnail },
            }
          );
        } catch (imageDeleteError) {
          console.error("Failed to delete image:", imageDeleteError);
        }
      }

      alert("Tin tức đã được xóa thành công!");
      router.push("/admin/bible-readings");
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

  if (!readings) {
    return (
      <div className="flex min-h-screen bg-[#f9f9ff] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy tin tức!</p>
          <Link
            href="/admin/bible-readings"
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
              href={`/admin/bible-readings/edit-readings/${readingsId}`}
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
          {readings.thumbnail && (
            <div className="relative h-64 md:h-80">
              <Image
                src={readings.thumbnail || "/placeholder.svg"}
                alt={readings.title}
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
                <span className="text-sm text-gray-500">ID: {readings.id}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {readings.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>
                  <strong>Danh mục:</strong>{" "}
                  {readings.category?.name || `ID: ${readings.categoryId}`}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nội dung bài đọc 1:
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: htmlReading1 || "Không có nội dung ",
                }}
              />
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nội dung đáp ca:
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: htmlPsalm || "Không có nội dung ",
                }}
              />
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nội dung bài đọc 2:
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: htmlReading2 || "Không có nội dung ",
                }}
              />
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nội dung alleluia:
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: htmlAlleluia || "Không có nội dung ",
                }}
              />
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Nội dung đoạn Tin Mừng:
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: htmlGospel || "Không có nội dung ",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
