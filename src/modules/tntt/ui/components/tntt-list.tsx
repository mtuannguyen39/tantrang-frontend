"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import TnttCard from "./tntt-card";
import { Button } from "@/components/ui/button";
import CategoryFilters from "@/modules/categories/components/category-filters";

interface TnttItem {
  id: number;
  title: string;
  thumbnail: string;
  categoryId: number;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function TnttList() {
  const [tntt, setTntt] = useState<TnttItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTntt = async () => {
    const res = await axios.get(
      // "https://tantrang-backend.onrender.com/api/tntt"
      "http://localhost:3001/api/tntt"
    );
    setTntt(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      // "https://tantrang-backend.onrender.com/api/category"
      "http://localhost:3001/api/category"
    );
    setCategories(res.data);
  };

  useEffect(() => {
    fetchTntt();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredTntt = selectedCategory
    ? tntt.filter((n) => n.categoryId === selectedCategory)
    : tntt;

  const totalPages = Math.ceil(filteredTntt.length / itemsPerPage);
  const featured = filteredTntt.find((n) => n.isFeatured);
  const others = filteredTntt.filter((n) => !n.isFeatured);

  const paginatedNews = others.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <CategoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-8 mt-6">
        {currentPage === 1 && featured && (
          <TnttCard
            key={featured.id}
            id={featured.id}
            title={featured.title}
            thumbnail={featured.thumbnail}
            isFeatured
            className="col-span-2 row-span-2"
          />
        )}
        {others.slice(0, 4).map((item) => (
          <TnttCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
      {/* Phân trang */}
      {/* <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {page}
          </Button>
        ))}
      </div> */}
    </div>
  );
}
