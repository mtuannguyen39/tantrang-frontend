"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import TnttCard from "./tntt-card";

interface TnttItem {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  categoryId: number;
  isFeatured?: boolean;
}

export default function TnttList() {
  const [tntt, setTntt] = useState<TnttItem[]>([]);

  const fetchTntt = async () => {
    const res = await axios.get(
      // "https://tantrang-backend.onrender.com/api/tntt"
      "http://localhost:3001/api/tntt"
    );
    setTntt(res.data);
  };

  useEffect(() => {
    fetchTntt();
  }, []);

  const filteredTntt = tntt;
  const featured = filteredTntt.find((n) => n.isFeatured);
  const others = filteredTntt.filter((n) => !n.isFeatured);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 mt-6">
        {featured && (
          <TnttCard
            key={featured.id}
            id={featured.id}
            title={featured.title}
            description={featured.description}
            thumbnail={featured.thumbnail}
            isFeatured
            className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 row-span-1 sm:row-span-2"
          />
        )}
        {others.slice(0, 4).map((item) => (
          <TnttCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}
