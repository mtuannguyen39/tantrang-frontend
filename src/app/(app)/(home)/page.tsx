import NewsList from "@/modules/news/ui/components/news-list";
import TnttList from "@/modules/tntt/ui/components/tntt-list";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="container mx-auto p-4">
      {/* <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Cập nhật mới nhất
      </h2> */}
      <section className="mt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800 pb-2">
            Tin tức chung
          </h3>
          <Link
            href={`/news`}
            className="text-blue-600 underline hover:text-blue-900 transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-base sm:text-lg self-start sm:self-auto"
          >
            Xem thêm
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        <NewsList /> {/* TODO: Add more news button */}
      </section>

      <section className="mt-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800 pb-2">
            Tin tức Thiếu Nhi Thánh Thể
          </h3>
          <Link
            href={`/tntt`}
            className="text-blue-600 underline hover:text-blue-900 transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-base sm:text-lg self-start sm:self-auto group"
          >
            Xem thêm
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        <TnttList />
        {/* TODO: Add more TNTT news button */}
      </section>
    </div>
  );
};

export default Page;
