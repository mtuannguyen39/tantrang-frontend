const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

console.log("[v0] API_BASE_URL configured as:", API_BASE_URL);
console.log(
  "[v0] NEXT_PUBLIC_API_URL env var:",
  process.env.NEXT_PUBLIC_API_URL
);

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "SUPER_ADMIN" | "NEWS_ADMIN" | "TNTT_ADMIN" | "BIBLE_ADMIN";
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  creator?: { username: string };
}

export interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

class AdminAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem("adminToken");
    console.log("[v0] Token from localStorage:", token ? "exists" : "missing");
    console.log("[v0] Making request to:", API_BASE_URL);
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const url = `${API_BASE_URL}/api/admin/auth/login`;
    console.log("[v0] Login request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    console.log("[v0] Login response status:", response.status);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      console.log("[v0] Login error:", error);
      throw new Error(error.message || "Đăng nhập thất bại");
    }

    const result = await response.json();
    console.log("[v0] Login successful, token received:", !!result.token);
    return result;
  }

  async getProfile(): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/profile`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin profile");
    }

    const result = await response.json();
    console.log("[v0] Profile response:", result);
    return result.admin || result; // Return admin object from wrapped response
  }

  async getAllAdmins(): Promise<{ admins: AdminUser[] }> {
    const headers = this.getAuthHeaders();
    console.log("[v0] Request headers:", headers);

    const response = await fetch(
      `${API_BASE_URL}/api/admin/management/admins`,
      {
        headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[v0] API Error:", response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async createAdmin(adminData: CreateAdminRequest): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Tạo admin thất bại");
    }

    return response.json();
  }

  async deleteAdmin(adminId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/management/admins/${adminId}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Xóa admin thất bại");
    }
  }

  async updateAdmin(
    adminId: number,
    updateData: Partial<CreateAdminRequest>
  ): Promise<AdminUser> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/management/admins/${adminId}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Cập nhật admin thất bại");
    }

    return response.json();
  }

  async getStats(): Promise<{
    liturgicalYearCount: number;
    newsCount: number;
    tnttCount: number;
    bibleCount: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Không thể lấy thống kê");
    }

    return response.json();
  }

  async bootstrap(adminData: CreateAdminRequest): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/bootstrap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Tạo Super Admin thất bại");
    }

    const result = await response.json();
    return result.admin;
  }
}

export const adminAPI = new AdminAPI();
export default adminAPI;
