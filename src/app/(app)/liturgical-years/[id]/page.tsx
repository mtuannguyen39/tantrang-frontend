"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import NewsList from "@/modules/news/ui/components/news-list";
import Navbar from "@/modules/home/ui/Navbar";
import Footer from "@/modules/home/ui/Footer";

interface LiturgicalYearProps {
  id: number;
  name: string;
  code: string;
  year: number;
  // Maybe sẽ có các thuộc tính khác nữa (có thể update sau này)
}

export default function LiturgicalYearDetailPage() {
  const { id } = useParams();
  const liturgicalYearId = id ? parseInt(id as string) : null;
  const [yearDetail, setYearDetail] = useState<LiturgicalYearProps | null>(
    null
  );

  useEffect(() => {
    if (liturgicalYearId) {
      axios
        .get<LiturgicalYearProps>(
          `http://localhost:3001/api/year/${liturgicalYearId}`
        )
        .then((res) => setYearDetail(res.data))
        .catch((error) =>
          console.error("Lỗi khi tải chi tiết năm phụng vụ:", error)
        );
    }
  }, [liturgicalYearId]);

  if (!liturgicalYearId)
    return (
      <div className="container mx-auto p-4 text-center">
        Năm phụng vụ không phù hợp
      </div>
    );

  if (!yearDetail) {
    return (
      <div className="container mx-auto p-4 text-center">
        Đang tải tin tức về năm phụng vụ...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-purple-800">
          {yearDetail.name} ({yearDetail.code} - {yearDetail.year})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p className="text-base sm:text-lg mb-2">
            <span className="font-bold">Mã năm phụng vụ:</span>{" "}
            {yearDetail.code}
          </p>
          <p className="text-base sm:text-lg mb-2">
            <span className="font-bold">Năm phụng vụ:</span> {yearDetail.year}
          </p>
        </div>
        <p className="text-base sm:text-lg text-gray-700 mb-6">
          Đây là trang thông tin chi tiết về năm phụng vụ {yearDetail.name}. Bạn
          có thể tìm tin tức liên quan tại đây.
        </p>
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Tin tức liên quan đến {yearDetail.name}
        </h3>
        <NewsList liturgicalYearId={liturgicalYearId} />
      </div>
      <Footer />
    </div>
  );
}
