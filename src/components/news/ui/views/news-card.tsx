import Image from "next/image";

interface NewsCardProps {
  id: number;
  title: string;
  thumbnail: string;
  isFeatured?: boolean;
}

export default function NewsCard({
  title,
  thumbnail,
  isFeatured = false,
}: NewsCardProps) {
  return (
    <div className={isFeatured ? "col-span-2" : "w-full"}>
      <div className="bg-white shadow rounded overflow-hidden hover:shadow-md transition duration-200">
        <Image
          src={thumbnail}
          alt={title}
          width={isFeatured ? 600 : 300}
          height={isFeatured ? 200 : 200}
          className="w-full object-cover"
        />
        <div className="p-4">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate text-center">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
