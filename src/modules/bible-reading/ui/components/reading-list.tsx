"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import ReadingCard from "./reading-card";
import { useSearchParams } from "next/navigation";

interface ReadingProps {
  id: number;
  title: string;
  //   description: string;
  scripture: string;
  thumbnail?: string;
  categoryId?: number;
  liturgicalYearId?: number;
}

interface ReadingListProps {
  liturgicalYearId?: number;
  query?: string;
}

const API_BASE_URL = "http://localhost:3001/api";
const API_SERVER_URL = "https://tantrang-backend.onrender.com/api/reading";

export default function ReadingList({ liturgicalYearId }: ReadingListProps) {
  const [readings, setReadings] = useState<ReadingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const url =
        liturgicalYearId ?
          `${API_BASE_URL}/reading?liturgicalYearId=${liturgicalYearId}`
        : `${API_BASE_URL}/reading`;

      const res = await axios.get(url);
      setReadings(res.data);
    } catch (error) {
      console.error("Lỗi khi tải thông tin ngày lễ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [liturgicalYearId]);

  const filteredReadings =
    query ?
      readings.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.scripture.toLowerCase().includes(query.toLowerCase())
      )
    : readings;

  const displayReadings = filteredReadings.slice(0, 12);
  const totalCount = displayReadings.length;

  // Calculate grid columns based on total count
  const getGridCols = (count: number) => {
    if (count <= 1) return "grid-cols-1";
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count <= 4)
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    if (count <= 6)
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin ngày lễ....</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {query && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-blue-800">
            {filteredReadings.length > 0 ?
              `Tìm thấy ${filteredReadings.length} tin tức cho "${query}"`
            : `Không tìm thấy tin tức nào cho "${query}"`}
          </p>
        </div>
      )}

      {filteredReadings.length === 0 && query ?
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
      : <div className={`grid ${getGridCols(totalCount)} gap-4 mb-8 mt-8`}>
          {displayReadings.map((item) => (
            <ReadingCard
              key={item.id}
              id={item.id}
              title={item.title}
              scripture={item.scripture}
              thumbnail={item.thumbnail || ""}
              // description={reading.description}
            />
          ))}
        </div>
      }
    </div>
  );
}
