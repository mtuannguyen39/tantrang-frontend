import NewsList from "@/modules/news/ui/components/news-list";
import TnttList from "@/modules/tntt/ui/components/tntt-list";
import React from "react";

const Page = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Cập nhật mới nhất
      </h2>
      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 pb-2">
          Tin tức chung
        </h3>
        <NewsList /> {/* TODO: Add more news button */}
      </section>

      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 pb-2">
          Tin tức Thiếu Nhi Thánh Thể
        </h3>
        <TnttList />
        {/* TODO: Add more TNTT news button */}
      </section>
    </div>
  );
};

export default Page;
