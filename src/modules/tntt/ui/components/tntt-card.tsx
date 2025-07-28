import Image from "next/image";
import Link from "next/link";

interface TnttCardProps {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  isFeatured?: boolean;
  className?: string;
}

export default function TnttCard({
  id,
  title,
  thumbnail,
  description,
  isFeatured = false,
  className = "",
}: TnttCardProps) {
  return (
    <div
      className={`${className} bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-200 flex flex-col h-full`}
    >
      <Link href={`/tntt/${id}`} className="flex flex-col h-full">
        {thumbnail ? (
          isFeatured ? (
            // Featured: ảnh lớn
            <Image
              src={thumbnail}
              alt={title}
              width={800}
              height={400}
              className="object-cover w-full h-48 sm:h-64 md:h-80"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            // Không Featured: ảnh nhỏ đều nhau
            <div className="w-full relative" style={{ paddingTop: "60%" }}>
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          )
        ) : (
          <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 flex-1">
            {description}
          </p>
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
