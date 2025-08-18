"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NewsCard from "./news-card";

interface NewsItem {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  categoryId: number;
  isFeatured?: boolean;
  liturgicalYearId?: number;
}

interface NewsListProps {
  liturgicalYearId?: number;
  news: any;
}

export default function NewsList({ liturgicalYearId }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>([]);

  const fetchNews = async () => {
    const url =
      liturgicalYearId ?
        `http://localhost:3001/api/news?liturgicalYearId=${liturgicalYearId}`
      : "http://localhost:3001/api/news";

    const res = await axios.get(
      // "https://tantrang-backend.onrender.com/api/news"
      url
    );
    setNews(res.data);
  };

  useEffect(() => {
    fetchNews();
  }, [liturgicalYearId]);

  const filteredNews = news;
  const featured = filteredNews.find((n) => n.isFeatured);
  const others = filteredNews.filter((n) => !n.isFeatured);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 mt-6">
        {featured && (
          <NewsCard
            key={featured.id}
            id={featured.id}
            title={featured.title}
            content={featured.content}
            thumbnail={featured.thumbnail}
            isFeatured
            className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 row-span-1 sm:row-span-2"
          />
        )}
        {others.slice(0, 4).map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}
