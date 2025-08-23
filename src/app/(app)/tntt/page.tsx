import Navbar from "@/modules/home/ui/Navbar";
import React, { Suspense } from "react";
import TnttListWrapper from "@/modules/tntt/ui/components/tntt-list-wrapper";

export default function NewsPage() {
  return (
    <div>
      <Navbar />
      <div className="p-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Tin tức Thiếu Nhi Thánh Thể</h2>
        <Suspense fallback={<TnttListSkeleton />}>
          <TnttListWrapper />
        </Suspense>
      </div>
    </div>
  );
}

const TnttListSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
      <div className="p-4 border rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
