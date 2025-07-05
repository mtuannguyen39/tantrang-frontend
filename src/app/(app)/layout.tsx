import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const mont = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nhà thờ Tân Trang",
  description: "Được tạo bởi @nmtuandev",
};

/**
 * Root layout component that defines the global HTML structure, applies the DM Sans font, and provides tRPC context and toast notifications to all child components.
 *
 * @param children - The content to be rendered within the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mont.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
