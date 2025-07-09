"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NewsCard from "./news-card";
import { Button } from "@/components/ui/button";

interface NewsItem {
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

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNews = async () => {
    const res = await axios.get("http://localhost:3001/api/news");
    setNews(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3001/api/category");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const filteredNews = selectedCategory
    ? news.filter((n) => n.categoryId === selectedCategory)
    : news;

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const featured = filteredNews.find((n) => n.isFeatured);
  const others = filteredNews.filter((n) => !n.isFeatured);

  const paginatedNews = others.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border rounded full ${
            selectedCategory === null
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Tất cả
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 border rounded full ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {currentPage === 1 && featured && (
          <NewsCard
            key={featured.id}
            id={featured.id}
            title={featured.title}
            thumbnail={`http://localhost:3001${featured.thumbnail}`}
            isFeatured
            className="col-span-2 row-span-2"
          />
        )}
        {others.slice(0, 4).map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnail={`http://localhost:3001${item.thumbnail}`}
            className=""
          />
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-2">
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
      </div>
    </div>
  );
}
