"use client";

import { useState, useEffect } from "react";
import CreateAdminModal from "@/components/admin/CreateAdminModal";
import { Plus, Trash2, Edit, Shield } from "lucide-react";
import { adminAPI, type AdminUser } from "@/lib/api/admin.api";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllAdmins();
      setAdmins(data.admins);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa admin này?")) return;

    try {
      await adminAPI.deleteAdmin(adminId);
      await fetchAdmins(); // Refresh list
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xóa admin thất bại");
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      SUPER_ADMIN: {
        color: "bg-purple-100 text-purple-800",
        label: "Super Admin",
      },
      NEWS_ADMIN: {
        color: "bg-blue-100 text-blue-800",
        label: "Quản lý Tin tức",
      },
      TNTT_ADMIN: {
        color: "bg-green-100 text-green-800",
        label: "Quản lý TNTT",
      },
      BIBLE_ADMIN: {
        color: "bg-orange-100 text-orange-800",
        label: "Quản lý Kinh Thánh",
      },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: role,
    };

    return config;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Admin</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tài khoản admin và phân quyền
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Tạo Admin mới
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tạo bởi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => {
                const roleConfig = getRoleBadge(admin.role);
                return (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-emerald-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admin.email}
                          </div>
                          {admin.phoneNumber && (
                            <div className="text-xs text-gray-400">
                              {admin.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleConfig.color}`}
                      >
                        {roleConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.isActive ?
                            "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.creator?.username || "System"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Chưa có admin nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bắt đầu bằng cách tạo admin đầu tiên.
            </p>
          </div>
        )}
      </div>

      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchAdmins}
      />
    </div>
  );
}
