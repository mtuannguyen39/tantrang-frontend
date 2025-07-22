import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  id: number;
  title: string;
  thumbnail: string;
  isFeatured?: boolean;
  className?: string;
}

export default function NewsCard({
  id,
  title,
  thumbnail,
  isFeatured = false,
  className = "",
}: NewsCardProps) {
  return (
    <div
      className={`${className} bg-white shadow rounded overflow-hidden hover:shadow-md transition duration-200 flex flex-col`}
    >
      <Link href={`/news/${id}`}>
        {thumbnail ? (
          isFeatured ? (
            // Featured: ảnh lớn
            <Image
              src={thumbnail}
              alt={title}
              width={800}
              height={400}
              className="object-cover w-full h-[300px]"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          ) : (
            // Không featured: ảnh nhỏ đều nhau
            <Image
              src={thumbnail}
              alt={title}
              width={300}
              height={180}
              className="object-cover w-full h-[180px]"
              sizes="(min-width: 1024px) 300px, 100vw"
            />
          )
        ) : (
          <div className="w-full h-[180px] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="p-6 flex-1 flex items-center justify-center">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate text-center">
            {title}
          </h3>
        </div>
      </Link>
    </div>
  );
}
