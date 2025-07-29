"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { getTnttDetail, getTnttList } from "@/modules/tntt/server/procedures";

interface TnttItem {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
}

export default function TnttDetail() {
  const params = useParams();
  const id = Number(params?.id);
  const [tntt, setTntt] = useState<TnttItem | null>(null);
  const [relatedTntt, setRelatedTntt] = useState<TnttItem[]>([]);

  useEffect(() => {
    if (id) {
      getTnttDetail(id).then((data) => {
        if (data) setTntt(data);
      });
      //Lấy danh sách tin tức TNTT khác
      getTnttList().then((data) => {
        if (data) {
          const filteredTntt = data
            .filter((item: TnttItem) => item.id !== id)
            .slice(0, 4);
          setRelatedTntt(filteredTntt);
        }
      });
    }
  }, [id]);

  if (!tntt) return <p className="text-center text-gray-500">Đang tải...</p>;
  return (
    <div className="bg-gray-100 flex flex-col items-center min-h-screen pt-2 pb-2 px-2">
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
      {/* Chi tiết tin tức TNTT */}
      <div className="w-full max-w-3xl px-2 sm:px-4 py-6 bg-white rounded-md shadow-md mt-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 text-center break-words">
          {tntt.title}
        </h1>
        {tntt.thumbnail && (
          <Image
            src={tntt.thumbnail}
            alt={tntt.title}
            width={800}
            height={400}
            className="rounded-lg mb-6 w-full object-cover max-h-72 sm:max-h-96"
          />
        )}
        <div className="text-gray-900 font-medium leading-relaxed whitespace-pre-line text-wrap text-justify text-base sm:text-lg">
          {tntt.description}
        </div>
        {/* Tin tức TNTT khác */}
        <div className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Tin tức TNTT khác
          </h2>
          {relatedTntt.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedTntt.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <Link
                    href={`/tntt/${item.id}`}
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
          ) : (
            <p className="text-gray-500">Không có tin tức khác</p>
          )}
        </div>
      </div>
    </div>
  );
}
