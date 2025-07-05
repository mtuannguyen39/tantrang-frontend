import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Good morning, User</h1>
          <p className="text-sm text-gray-500">
            Take a look at the latest updates for your dashboard
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}
