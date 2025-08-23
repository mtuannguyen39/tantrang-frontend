import ReadingListWrapper from "@/modules/bible-reading/ui/components/reading-list-wrapper";
import Navbar from "@/modules/home/ui/Navbar";
import { Suspense } from "react";

export default function BibleReadingsPage() {
  return (
    <div>
      <Navbar />
      <div className="p-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Lời Chúa</h2>
        <Suspense fallback={<ReadingsListSkeleton />}>
          <ReadingListWrapper />
        </Suspense>
      </div>
    </div>
  );
}

const ReadingsListSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
      <div className="p-4 border rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
