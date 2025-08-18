import { Search } from "@/components/search-params";
import Navbar from "@/modules/home/ui/Navbar";
import NewsList from "@/modules/news/ui/components/news-list";
import React, { Suspense } from "react";

function SearchWrapper() {
  return <Search />;
}

function NewsListWrapper() {
  return <NewsList />;
}

export default async function NewsPage() {
  return (
    <div className="container mx-auto">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex justity-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải tin tức...</p>
            </div>
          </div>
        }
      >
        <NewsListWrapper />
      </Suspense>
    </div>
  );
}
