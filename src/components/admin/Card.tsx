"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, FileText, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api/admin.api";

interface DashboardStats {
  liturgicalYearCount: number;
  newsCount: number;
  tnttCount: number;
  bibleCount: number;
}

const AdminCard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.getStats();
        setStats(response);
      } catch (err) {
        console.error("[v0] Stats fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
            Welcome back !!!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-5">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
            Welcome back User
          </h1>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 md:p-6 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to load dashboard stats
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
            Welcome back User
          </h1>
          <p>No stats available</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          Welcome back User
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-r from-[#FF2CDF] to-[#0014FF] text-white">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm">Năm phụng vụ</p>
                  <h2 className="text-lg md:text-2xl font-bold">
                    {stats.liturgicalYearCount}
                  </h2>
                </div>
                <Calendar size={24} className="md:w-8 md:h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#00ff5b] to-[#0014ff] text-white">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm">All news</p>
                  <h2 className="text-lg md:text-2xl font-bold">
                    {stats.newsCount}
                  </h2>
                </div>
                <FileText size={24} className="md:w-8 md:h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#ffe53b] to-[#ff2525] text-white">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm">TNTT News</p>
                  <h2 className="text-lg md:text-2xl font-bold">
                    {stats.tnttCount}
                  </h2>
                </div>
                <Users size={24} className="md:w-8 md:h-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#ffe53b] to-[#00FFFF] text-white">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm">Bible Readings</p>
                  <h2 className="text-lg md:text-2xl font-bold">
                    {stats.bibleCount}
                  </h2>
                </div>
                <Calendar size={24} className="md:w-8 md:h-8" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminCard;
