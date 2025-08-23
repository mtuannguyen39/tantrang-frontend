import ReadingListWrapper from "@/modules/bible-reading/ui/components/reading-list-wrapper";
import Navbar from "@/modules/home/ui/Navbar";
import { Suspense } from "react";

export default function BibleReadingsPage() {
  return (
    <div>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4">
                <p className="text-gray-600">Đang tải tin tức...</p>
              </div>
            </div>
          </div>
        }
      >
        <div className="p-4 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Lời Chúa</h2>
          <ReadingListWrapper />
        </div>
      </Suspense>
    </div>
  );
}
