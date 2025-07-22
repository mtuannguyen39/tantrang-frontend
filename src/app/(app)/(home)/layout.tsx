import Footer from "@/modules/home/ui/Footer";
import Navbar from "@/modules/home/ui/Navbar";
import NewsList from "@/modules/news/ui/components/news-list";
import React from "react";

const layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1">
        <NewsList />
      </div>
      <Footer />
    </div>
  );
};

export default layout;
