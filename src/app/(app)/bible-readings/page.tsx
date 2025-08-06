"use client";

import ReadingList from "@/modules/bible-reading/ui/components/reading-list";
import Navbar from "@/modules/home/ui/Navbar";

export default function BibleReadingsPage() {
  return (
    <div>
      <Navbar />
      <div className="p-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Lời Chúa</h2>
        <ReadingList />
      </div>
    </div>
  );
}
