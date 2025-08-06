"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import ReadingCard from "./reading-card";

interface ReadingProps {
  id: number;
  title: string;
  //   description: string;
  scripture: string;
  thumbnail?: string;
  categoryId?: number;
  liturgicalYearId?: number;
}

interface ReadingListProps {
  liturgicalYearId?: number;
}

const API_BASE_URL = "http://localhost:3001/api";
const SERVER_URL = "https://tantrang-backend.onrender.com/api/reading";

export default function ReadingList({ liturgicalYearId }: ReadingListProps) {
  const [readings, setReadings] = useState<ReadingProps[]>([]);

  const fetchReadings = async () => {
    const url =
      liturgicalYearId ?
        `${API_BASE_URL}/reading?liturgicalYearId=${liturgicalYearId}`
      : `${API_BASE_URL}/reading`;

    const res = await axios.get(url);
    setReadings(res.data);
  };

  useEffect(() => {
    fetchReadings();
  }, [liturgicalYearId]);

  //   const filteredReadings = readings.filter(
  //     (reading) =>
  //       !reading.liturgicalYearId || reading.liturgicalYearId === liturgicalYearId
  //   );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 mt-8">
        {/* {filteredReadings.map((reading) => (
          <ReadingCard
            key={reading.id}
            id={reading.id}
            title={reading.title}
            scripture={reading.scripture}
            thumbnail={reading.thumbnail || ""}
            // description={reading.description}
          />
        ))} */}
        {readings.map((reading) => (
          <ReadingCard
            key={reading.id}
            id={reading.id}
            title={reading.title}
            scripture={reading.scripture}
            thumbnail={reading.thumbnail || ""}
            // description={reading.description}
          />
        ))}
      </div>
    </div>
  );
}
