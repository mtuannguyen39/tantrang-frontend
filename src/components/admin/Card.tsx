import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, FileText, BarChart2 } from "lucide-react";

async function getDashboardStats() {
  const res = await fetch(
    // "https://tantrang-backend.onrender.com/api/admin/stats",
    "http://localhost:3001/api/admin/stats",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Fetching stats error");
  }
  return res.json();
}

const AdminCard = async () => {
  const stats = await getDashboardStats();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Welcome back User</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-[#FF2CDF] to-[#0014FF] text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Today's Appointments</p>
                  <h2 className="text-2xl font-bold">120</h2>
                </div>
                <Calendar size={32} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#00ff5b] to-[#0014ff] text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">All news</p>
                  <h2 className="text-2xl font-bold">{stats.newsCount}</h2>
                </div>
                <FileText size={32} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#ffe53b] to-[#ff2525] text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">TNTT News</p>
                  <h2 className="text-2xl font-bold">{stats.tnttCount}</h2>
                </div>
                <Users size={32} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#ffe53b] to-[#00FFFF] text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Bible Readings</p>
                  <h2 className="text-2xl font-bold">{stats.bibleCount}</h2>
                </div>
                <Calendar size={32} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminCard;
