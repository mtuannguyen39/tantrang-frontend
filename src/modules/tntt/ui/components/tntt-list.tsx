"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import TnttCard from "./tntt-card";
import { useSearchParams } from "next/navigation";

interface TnttItem {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  categoryId: number;
  isFeatured?: boolean;
}

interface TnttListProps {
  query?: string;
}

export default function TnttList() {
  const [tntt, setTntt] = useState<TnttItem[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const fetchTntt = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        // "https://tantrang-backend.onrender.com/api/tntt"
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tntt`
      );
      setTntt(res.data);
    } catch (error) {
      console.error("Lỗi khi tải tin tức TNTT:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTntt();
  }, []);

  const filteredTntt =
    query ?
      tntt.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : tntt;
  const featured = filteredTntt.find((n) => n.isFeatured);
  const others = filteredTntt.filter((n) => !n.isFeatured);

  const displayedOthers = others.slice(0, 12);
  const totalItems = (featured ? 1 : 0) + displayedOthers.length;

  // Dynamic grid classes based on total items
  const getGridCols = () => {
    if (totalItems <= 1) return "grid-cols-1";
    if (totalItems <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (totalItems <= 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";
    if (totalItems <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (totalItems <= 8)
      return "grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4";
    if (totalItems <= 10)
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tin Thiếu Nhi Thánh Thể...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {query && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-blue-800">
            {filteredTntt.length > 0 ?
              `Tìm thấy ${filteredTntt.length} tin tức cho "${query}"`
            : `Không tìm thấy tin tức nào cho ${query}`}
          </p>
        </div>
      )}

      {filteredTntt.length === 0 && query ?
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy kết quả mà bạn đang tìm kiếm
          </h3>
          <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
        </div>
      : <div className={`grid ${getGridCols()} gap-4 mb-8 mt-6`}>
          {featured && (
            <TnttCard
              key={featured.id}
              id={featured.id}
              title={featured.title}
              description={featured.description}
              thumbnail={featured.thumbnail}
              isFeatured
              className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 row-span-1 sm:row-span-2"
            />
          )}
          {displayedOthers.map((item) => (
            <TnttCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              thumbnail={item.thumbnail}
            />
          ))}
        </div>
      }
    </div>
  );
}
