import { Search } from "@/components/search-params";
import { Spinner } from "@/components/spinner";
import Navbar from "@/modules/home/ui/Navbar";
import { getAllNews } from "@/modules/news/server/procedures";

import NewsList from "@/modules/news/ui/components/news-list";
import React, { Suspense } from "react";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const news = await getAllNews();
  return (
    <div className="container mx-auto">
      {/* <Suspense
        fallback={
          <div className="flex justify-center py-8">
          <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <NewsResult query={searchParams.q} />
      </Suspense> */}
      <Navbar />
      <NewsList news={news} />
      {/*<div className="p-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Tin tức chung</h2>
        <NewsList />
      </div> */}
    </div>
  );
}

// async function NewsResult({ query }: { query: string }) {
//   try {
//     const news = await getNewsList();
//     return <NewsList news={news} query={query} />;
//   } catch (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">
//           Không thể tải tin tức. Vui lòng thử lại sau.
//         </p>
//       </div>
//     );
//   }
//}
