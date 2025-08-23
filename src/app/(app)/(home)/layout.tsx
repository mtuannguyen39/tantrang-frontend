// app/(app)/(home)/layout.tsx
import Footer from "@/modules/home/ui/Footer";
import Navbar from "@/modules/home/ui/Navbar";
import { ReactNode } from "react";

// Force dynamic rendering for home route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
