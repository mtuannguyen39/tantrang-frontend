"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getAllNews, getNewsDetail } from "@/modules/news/server/procedures";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

interface NewsProps {
  id: number;
  title: string;
  content?: string;
  thumbnail?: string;
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\^(.*?)\^/g, "<sup>$1</sup>") // Đặt lên đầu
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\n/g, "<br>");
}

export default function NewsDetail() {
  const params = useParams();
  const id = Number(params?.id);
  const [news, setNews] = useState<NewsProps | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [relatedNews, setRelatedNews] = useState<NewsProps[]>([]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await getNewsDetail(id);
        setNews(data);

        if (data && data.content) {
          const htmlDataContent = await markdownToHtml(data.content);
          setHtmlContent(htmlDataContent);
        }

        // Lấy danh sách bài đọc
        const allNews = await getAllNews();
        if (allNews) {
          const filteredNews = allNews
            .filter((item: NewsProps) => item.id !== id)
            .slice(0, 4);
          setRelatedNews(filteredNews);
        }
      } catch (error) {
        console.error("Failed to fetch news detail:", error);
      }
    })();
  }, [id]);

  if (!news) return <p className="text-center text-gray-500">Đang tải....</p>;
  return (
    <div className="bg-gray-100 flex flex-col">
      {/* Link quay trở về */}
      <div className="hidden md:flex flex-row ml-36 mt-8 gap-2">
        <Link
          href={`/`}
          className="text-gray-500 hover:text-blue-700 hover:underline transition-colors"
        >
          Trang chủ
        </Link>
        <div className="text-gray-500 transition-colors"> / </div>
        <Link
          href={`/news`}
          className="text-gray-500 hover:text-blue-700 hover:underline transition-colors"
        >
          Trang tin tức chung
        </Link>
        <div className="text-gray-500 transition-colors"> / </div>
        <div className="text-gray-500 transition-colors">{news.title}</div>
        {/* Nút quay trở về trang tin tức Thiếu Nhi Thánh Thể ở giao diện mobile */}
      </div>
      <Link
        href={`/news`}
        className="md:hidden sm:block flex gap-2 underline mt-2 ml-2 text-base text-gray-500 transition-colors"
      >
        <ArrowLeft />
        Quay trở về
      </Link>
      <div className=" flex flex-col items-center min-h-screen pt-2 pb-2 px-2">
        {/* Sidebar mạng xã hội - chỉ hiện trên md trở lên */}
        <div className="hidden md:flex flex-col fixed gap-3 left-8 top-32 drop-shadow-2xl z-10">
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
        <div className="w-full max-w-3xl px-2 sm:px-4 py-6 bg-white rounded-md shadow-md mt-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 text-center break-words">
            {news.title}
          </h1>
          {news.thumbnail && (
            <Image
              src={news.thumbnail}
              alt={news.title}
              width={800}
              height={600}
              className="rounded-lg mb-6 w-full object-cover max-h-72 sm:max-h-96"
            />
          )}
          <div
            className="text-gray-900 font-medium leading-relaxed max-w-none text-wrap text-justify text-base sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: htmlContent || news.content || "Không có nội dung",
            }}
          />
          {/* Tin tức khác */}
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Tin tức khác
            </h2>
            {relatedNews.length > 0 ?
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedNews.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <Link
                      href={`/news/${item.id}`}
                      className="flex flex-col gap-2 overflow-hidden"
                    >
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={100}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <p className="flex-1 justify-center overflow-hidden text-ellipsis whitespace-nowrap items-center text-gray-900 font-medium hover:underline text-sm">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            : <p className="text-gray-500">Không có tin tức khác</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
