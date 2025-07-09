import Footer from "@/modules/home/ui/Footer";
import Navbar from "@/modules/home/ui/Navbar";
import NewsDetail from "@/modules/news/ui/views/NewsDetail";
import dynamic from "next/dynamic";

// const NewsDetail = dynamic(
//   () => import("@/app/(app)/(home)/components/NewsDetail"),
//   { ssr: false }
// );

export default function NewsDetailPage() {
  return (
    <div>
      <Navbar />
      <NewsDetail />
      <Footer />
    </div>
  );
}
