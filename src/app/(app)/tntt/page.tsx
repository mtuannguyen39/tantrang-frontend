"use client";

import Navbar from "@/modules/home/ui/Navbar";
import TnttList from "@/modules/tntt/ui/components/tntt-list";
import React, { Suspense } from "react";

export default function NewsPage() {
  return (
    <div>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex justity-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Đang tải tin tức Thiếu Nhi Thánh Thể...
              </p>
            </div>
          </div>
        }
      >
        <div className="p-4 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Tin tức Thiếu Nhi Thánh Thể
          </h2>
          <TnttList />
        </div>
      </Suspense>
    </div>
  );
}
