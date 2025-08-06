import ReadingDetails from "@/modules/bible-reading/ui/views/reading-details";
import Navbar from "@/modules/home/ui/Navbar";
import Footer from "@/modules/home/ui/Footer";

export default function BibleDetailPage() {
  return (
    <div>
      <Navbar />
      <ReadingDetails />
      {/* Footer can be added here if needed */}
      {/* <Footer /> */}
    </div>
  );
}
