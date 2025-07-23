"use client";

import Footer from "@/modules/home/ui/Footer";
import Navbar from "@/modules/home/ui/Navbar";
import NewsList from "@/modules/news/ui/components/news-list";
import TnttList from "@/modules/tntt/ui/components/tntt-list";
import React, { useState } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 p-4">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
