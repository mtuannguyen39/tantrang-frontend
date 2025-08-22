"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import {
  getAllTntt,
  getTnttDetail,
  getTnttList,
} from "@/modules/tntt/server/procedures";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

interface TnttProps {
  id: number;
  title: string;
  slug?: string;
  description: string;
  thumbnail?: string;
  categoryId: number;
  createdAt?: string;
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

export default function TnttDetail() {
  const params = useParams();
  const id = Number(params?.id);
  const [tntt, setTntt] = useState<TnttProps | null>(null);
  const [htmlDescription, setHtmlDescription] = useState<string>("");
  const [relatedTntt, setRelatedTntt] = useState<TnttProps[]>([]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await getTnttDetail(id);
        setTntt(data);

        if (data) {
          if (data) setHtmlDescription(markdownToHtml(data.description));
        }

        const allTntt = await getAllTntt();
        if (allTntt) {
          const filteredTntt = allTntt
            .filter((item: TnttProps) => item.id !== id)
            .slice(0, 4);
          setRelatedTntt(filteredTntt);
        }
      } catch (error) {
        console.error("Failed to fetch TNTT detail:", error);
      }
    })();
  }, [id]);

  if (!tntt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">
            Đang tải tin tức Thiếu nhi Thánh Thể...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header với breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href="/tntt"
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              Tin tức
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-medium truncate max-w-md">
              {tntt.title}
            </span>
          </div>

          {/* Mobile back button */}
          <Link
            href="/news"
            className="md:hidden flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại tin tức</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Hero image */}
              {tntt.thumbnail && (
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={tntt.thumbnail || "/placeholder.svg"}
                    alt={tntt.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              {/* Article content */}
              <div className="p-6 sm:p-8 lg:p-12">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {tntt.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar size={16} />
                    <span className="text-sm">Hôm nay</span>
                  </div>
                  <div className="flex items-center space-x-2 gap-2 text-slate-600">
                    <Clock size={16} />
                    {tntt.createdAt ?
                      new Date(tntt.createdAt).toLocaleDateString("vi-VN")
                    : ""}
                  </div>
                  <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors ml-auto">
                    <Share2 size={16} />
                    <span className="text-sm font-medium">Chia sẻ</span>
                  </button>
                </div>

                {/* Content */}
                <div
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:text-slate-900 prose-headings:font-bold
                    prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-strong:text-slate-900 prose-em:text-slate-700
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{
                    __html:
                      htmlDescription ||
                      tntt.description ||
                      "Không có nội dung",
                  }}
                />

                {/* Thumbnail image below content */}
                {tntt.thumbnail && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
                      <Image
                        src={tntt.thumbnail || "/placeholder.svg"}
                        alt={`Hình ảnh minh họa: ${tntt.title}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Social links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Theo dõi chúng tôi
              </h3>
              <div className="flex flex-row lg:flex-col gap-3">
                <Link
                  href="https://www.facebook.com/profile.php?id=100068910341526"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                >
                  <FaFacebook className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium group-hover:text-blue-800">
                    Facebook
                  </span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group"
                >
                  <FaYoutube className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 font-medium group-hover:text-red-800">
                    YouTube
                  </span>
                </Link>
              </div>
            </div>

            {/* Related tntt - mobile version */}
            <div className="lg:hidden bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                Tin tức khác
              </h3>
              {relatedTntt.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTntt.slice(0, 2).map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group block"
                    >
                      <div className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                        {item.thumbnail ?
                          <div className="relative h-32 overflow-hidden">
                            <Image
                              src={item.thumbnail || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        : <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-3xl">📰</span>
                          </div>
                        }
                        <div className="p-3">
                          <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              : <div className="text-center py-8 text-slate-500">
                  <span className="text-3xl mb-2 block">📰</span>
                  <p>Không có tin tức khác</p>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Related news - desktop full section */}
        <div className="hidden lg:block mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
            <div className="w-1 h-8 bg-blue-600 rounded-full mr-4"></div>
            Tin tức liên quan
          </h2>

          {relatedTntt.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTntt.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      {item.thumbnail ?
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      : <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <span className="text-4xl text-slate-400">📰</span>
                        </div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-3 group-hover:text-blue-600 transition-colors duration-200 mb-3">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-xs text-slate-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Tin tức chung</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          : <div className="text-center py-16 bg-slate-50 rounded-xl">
              <div className="text-slate-300 text-6xl mb-4">📰</div>
              <p className="text-slate-500 font-medium text-lg">
                Không có tin tức liên quan
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
