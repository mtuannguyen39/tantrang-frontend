"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";

import {
  getReadingDetail,
  getAllReading,
} from "@/modules/bible-reading/server/procedures";
import ReadingCard from "@/modules/bible-reading/ui/components/reading-card";

interface ReadingProps {
  id: number;
  title: string;
  description?: string;
  scripture: string;
  thumbnail?: string;
}

// async function markdownToHtml(markdown: string): Promise<string> {
//   return marked.parse(markdown);
// }

// Sử dụng lại hàm markdownToHtml của bạn
// (hoặc một thư viện chuyên dụng như 'marked' hay 'react-markdown')
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
export default function ReadingDetails() {
  const params = useParams();
  const id = Number(params?.id);
  const [readings, setReadings] = useState<ReadingProps | null>(null);
  const [relatedReadings, setRelatedReadings] = useState<ReadingProps[]>([]);
  const [htmlDescription, setHtmlDescription] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    // Sử dụng một hàm async IIFE để gọi các hàm async
    (async () => {
      try {
        const data = await getReadingDetail(id);
        setReadings(data);

        if (data && data.description) {
          // Chờ cho Promise giải quyết và gán kết quả
          const html = await markdownToHtml(data.description);
          setHtmlDescription(html);
        }

        // Lấy danh sách bài đọc khác
        const allReadings = await getAllReading();
        if (allReadings) {
          const filteredReadings = allReadings
            .filter((item: ReadingProps) => item.id !== id)
            .slice(0, 4);
          setRelatedReadings(filteredReadings);
        }
      } catch (error) {
        console.error("Failed to fetch reading details", error);
      }
    })();
  }, [id]);

  if (!readings)
    return <p className="text-center text-gray-500">Đang tải....</p>;

  return (
    <div className="bg-gray-100 flex flex-col items-center min-h-screen pt-2 pb-2 px-2">
      {/* SIDEBAR mạng xã hội - chỉ hiện trên tablet/desktop trở lên */}
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
      {/* Chi tiet bai doc */}
      <div className="w-full max-w-3xl px-2 sm:px-4 py-6 bg-white rounded-md shadow-md mt-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 text-center break-words">
          {readings.title}
        </h1>
        {readings.thumbnail && (
          <Image
            src={readings.thumbnail}
            alt={readings.title}
            width={800}
            height={400}
            className="rounded-lg mb-6 w-full object-cover max-h-72 sm:max-h-96"
          />
        )}
        <div
          className="text-gray-900 font-medium leading-relaxed  max-w-none text-wrap text-justify text-base sm:text-lg"
          dangerouslySetInnerHTML={{
            __html:
              htmlDescription ||
              readings.description ||
              "No description available.",
          }}
        />
        {/* Bài đọc khác */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Bài đọc khác</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedReadings.map((reading) => (
              <Link
                href={`/bible-readings/${reading.id}`}
                className="flex flex-col gap-2 overflow-hidden"
              >
                <ReadingCard
                  key={reading.id}
                  id={reading.id}
                  title={reading.title}
                  thumbnail={reading.thumbnail ?? ""}
                  scripture={reading.scripture}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
