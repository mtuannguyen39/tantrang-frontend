"use client";

import AdminCard from "@/components/admin/Card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.log("No admin token found, redirecting to login page");
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl fond-bold text-gray-900">Dashboard</h1>
      </div>
      <AdminCard />
    </div>
  );
}

export default AdminDashboard;
