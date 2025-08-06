import Image from "next/image";
import Link from "next/link";

interface ReadingCardProps {
  id: number;
  title: string;
  thumbnail: string;
  // description: string;
  scripture: string;
  className?: string;
}

export default function ReadingCard({
  id,
  title,
  thumbnail,
  // description,
  scripture,
  className = "",
}: ReadingCardProps) {
  return (
    <div
      className={`${className} bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-200 flex flex-col h-full`}
    >
      <Link href={`/bible-readings/${id}`} className="flex flex-col h-full">
        {thumbnail ?
          <div className="w-full relative" style={{ paddingTop: "60%" }}>
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        : <div className="w-full h-40 sm:h-40 md:h-55 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Không có hình ảnh</span>
          </div>
        }

        {/* Description Area */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
          {/* <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 flex-1">
            {description}
          </p> */}
          <div className="mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
              Đọc thêm →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
