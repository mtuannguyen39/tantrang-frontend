"use client";

import Navbar from "@/modules/home/ui/Navbar";
import NewsList from "@/modules/news/ui/components/news-list";
import React from "react";

export default function NewsPage() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Tin tức chung</h2>
        <NewsList />
      </div>
    </div>
  );
}
