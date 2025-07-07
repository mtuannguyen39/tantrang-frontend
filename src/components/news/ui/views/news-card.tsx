import Image from "next/image";

interface NewsCardProps {
  id: number;
  title: string;
  thumbnail: string;
  isFeatured?: boolean;
  className?: string;
}

export default function NewsCard({
  title,
  thumbnail,
  isFeatured = false,
  className = "",
}: NewsCardProps) {
  return (
    <div className={`${isFeatured ? "h-[350px]" : "h-[274px]"} ${className}`}>
      <div className={isFeatured ? "aspect-[4/3]" : "aspect-[4/3]"}>
        <div className="bg-white shadow rounded overflow-hidden hover:shadow-md transition duration-200 h-full flex flex-col">
          <Image
            src={thumbnail}
            alt={title}
            width={isFeatured ? 500 : 300}
            height={isFeatured ? 300 : 200}
            className="w-full h-full object-cover"
            sizes={isFeatured ? "(min-width: 1024px) 500px, 100vw" : "300px"}
          />
          <div className="p-4 flex-1 flex items-center justify-center">
            <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate text-center">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
