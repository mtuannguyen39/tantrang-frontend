// app/(app)/news/layout.tsx
import { ReactNode } from "react";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
