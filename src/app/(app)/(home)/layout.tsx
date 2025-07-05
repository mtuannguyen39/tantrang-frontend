import Footer from "@/components/home/ui/Footer";
import Navbar from "@/components/home/ui/Navbar";
import NewsList from "@/components/news/ui/views/news-list";
import React from "react";

const layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <NewsList />
      <Footer />
    </div>
  );
};

export default layout;
