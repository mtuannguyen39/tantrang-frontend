import axios from "axios";

interface BibleReading {
  id: number;
  title: string;
  slug: string;
  scripture: string;
  description: string;
  thumbnail?: string;
  liturgicalYearId: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface LiturgicalYear {
  id: number;
  title: string;
  name: string;
  code: string;
}

const API_BASE_URL = "http://localhost:3001/api";
const SERVER_URL = "https://tantrang-backend.onrender.com/api";

export async function getAllReading(): Promise<BibleReading[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/reading`);
    return res.data;
  } catch (error) {
    console.error("lỗi khi tải tin tức sách Kinh Thánh:", error);
    throw new Error("Không thể tải danh sách Kinh Thánh. Vui lòng thử lại!!!");
  }
}

export async function getReadingDetail(id: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}/reading/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết sách Kinh Thánh:", error);
    throw new Error(
      "Không thể tải chi tiết sách Kinh Thánh. Vui lòng thử lại!!!"
    );
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/category`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error);
    throw new Error("Không thể tải danh sách danh mục. Vui lòng thử lại!!!");
  }
}

export async function getAllLiturgicalYear(): Promise<LiturgicalYear[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/year`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách Năm Phụng Vụ:", error);
    throw new Error(
      "Không thể tải danh sách Năm Phụng Vụ. Vui lòng thử lại!!!"
    );
  }
}

export async function saveReading(
  payload: Omit<BibleReading, "id">,
  file: File | null,
  editingId: number | null
): Promise<void> {
  let thumbnailUrl = payload.thumbnail;

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await axios.post(
      `${API_BASE_URL}/reading/uploadBible`,
      formData
    );
    thumbnailUrl = uploadRes.data.url;
  }

  const finalPayload = { ...payload, thumbnail: thumbnailUrl };

  if (editingId !== null) {
    await axios.put(`${API_BASE_URL}/reading/${editingId}`, finalPayload);
  } else {
    await axios.post(`${API_BASE_URL}/reading`, finalPayload);
  }
}

export async function deleteReading(
  id: number,
  thumbnailUrl?: string
): Promise<void> {
  if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/reading/${id}`);
    if (!thumbnailUrl) return;

    if (thumbnailUrl) {
      try {
        await axios.delete(`${API_BASE_URL}/reading/delete-image`, {
          data: { thumbnailUrl: thumbnailUrl },
        });
        console.log("Phản hồi xóa hình ảnh: Đã xóa thành công!");
      } catch (imageDeleteError: any) {
        console.error("Lỗi khi xóa ảnh trên server:", imageDeleteError);
        if (imageDeleteError.response?.status === 404) {
          console.warn(
            "Hình ảnh không được tìm thấy trên server, nhưng tin tức đã xóa thành công!"
          );
        } else if (imageDeleteError.response?.status === 403) {
          throw new Error("Không có quyền xóa ảnh, nhưng tin tức đã bị xóa!");
        } else {
          throw new Error("Xóa ảnh không thành công, nhưng tin tức đã bị xóa!");
        }
      }
    }
    alert("Tin tức đã được xóa thành công!");
  } catch (error: any) {
    console.error("Lỗi khi xóa tin tức:", error);
    throw new Error(
      `Xóa tin tức thất bại. Vui lòng thử lại! ${error.message || ""}`
    );
  }
}

export async function deleteCurrentImage(thumbnailUrl: string): Promise<void> {
  if (!window.confirm("Bạn có chắc chắn muốn xóa hình ảnh hiện tại không?"))
    return;

  try {
    const deleteImageRes = await axios.delete(
      `${API_BASE_URL}/reading/delete-image`,
      {
        data: { thumbnailUrl: thumbnailUrl },
      }
    );
    console.log("Hình ảnh hiện tại đã được xóa:", deleteImageRes.data.message);
    alert("Ảnh hiện tại đã được xóa khỏi Database");
  } catch (err: any) {
    console.error("Lỗi khi xóa ảnh hiện tại:", err);
    throw new Error(
      `Lỗi khi xóa ảnh hiện tại: ${err.response?.data?.error || err.message}`
    );
  }
}
