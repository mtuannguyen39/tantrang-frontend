"use client";

import Navbar from "@/modules/home/ui/Navbar";
import TnttList from "@/modules/tntt/ui/components/tntt-list";
import React from "react";

export default function NewsPage() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Tin tức Thiếu Nhi Thánh Thể</h2>
        <TnttList />
      </div>
    </div>
  );
}
