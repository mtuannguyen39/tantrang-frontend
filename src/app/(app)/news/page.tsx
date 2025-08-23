import Navbar from "@/modules/home/ui/Navbar";
import NewsListWrapper from "@/modules/news/ui/components/news-list-wrapper";
import { Suspense } from "react";

export default async function NewsPage() {
  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="p-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Tin tức chung</h2>
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsListWrapper />
        </Suspense>
      </div>
    </div>
  );
}

const NewsListSkeleton = () => {
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
