"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getNewsDetail, getNewsList } from "@/modules/news/server/procedures";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  createdAt: string;
}

export default function NewsDetail() {
  const params = useParams();
  const id = Number(params?.id);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (id) {
      getNewsDetail(id).then((data) => {
        if (data) setNews(data);
      });
      // Lấy danh sách tin tức khác
      getNewsList().then((data) => {
        if (data) {
          const filteredNews = data
            .filter((item: NewsItem) => item.id !== id)
            .slice(0, 4);
          setRelatedNews(filteredNews);
        }
      });
    }
  }, [id]);

  if (!news) return <p className="text-center text-gray-500">Đang tải....</p>;
  return (
    <div className="bg-gray-100 flex justify-center gap-2 pt-2 pb-2">
      {/* Link bài viết */}
      <div className="flex flex-col fixed gap-3 left-[20%] mt-2 drop-shadow-2xl">
        <Link href="https://www.facebook.com/profile.php?id=100068910341526">
          <div className="bg-white p-4 rounded-2xl">
            <FaFacebook className="h-8 w-8 text-blue-600" />
          </div>
        </Link>
        <Link href="#">
          <div className="bg-white p-4 rounded-2xl">
            <FaYoutube className="h-8 w-8 text-red-600" />
          </div>
        </Link>
      </div>
      {/* Chi tiết tin tức */}
      <div className="min-w-3xl px-4 py-8 bg-white rounded-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{news.title}</h1>
        {news.thumbnail && (
          <Image
            // src={news.thumbnail}
            src={news.thumbnail}
            alt={news.title}
            width={800}
            height={400}
            className="rounded-lg mb-6 w-full object-cover"
          />
        )}
        <div className="text-gray-900 font-medium leading-relaxed whitespace-pre-line text-wrap text-justify">
          {news.content}
        </div>
        {/* Tin tức khác */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tin tức khác</h2>
          {relatedNews.length > 0 ? (
            <ul className="space-y-4 grid grid-cols-4 gap-4">
              {relatedNews.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <Link
                    href={`/news/${item.id}`}
                    className="flex flex-col gap-4 overflow-hidden"
                  >
                    {item.thumbnail && (
                      <Image
                        // src={item.thumbnail}
                        src={item.thumbnail}
                        alt={item.title}
                        width={100}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <p className="flex-1 justify-center overflow-hidden text-ellipsis whitespace-nowrap items-center text-gray-900 font-medium hover:underline">
                      {item.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không có tin tức khác</p>
          )}
        </div>
      </div>
    </div>
  );
}
