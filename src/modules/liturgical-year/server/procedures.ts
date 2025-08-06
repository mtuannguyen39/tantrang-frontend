import axios from "axios";

interface YearItem {
  id: number;
  name: string;
  code: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  categoryId: number;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = "http://localhost:3001/api";
const SERVER_URL = "https://tantrang-backend.onrender.com/api";

export async function getAllYear(): Promise<YearItem[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/year`);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải tin tức năm phụng vụ: ", err);
    throw new Error(
      "Không thể tải danh sách tin tức năm phụng vụ. Vui lòng thử lại!!!"
    );
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/category`);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh mục: ", err);
    throw new Error("Không thể tải danh sách danh mục. Vui lòng thử lại!!!");
  }
}

export async function saveYear(
  payload: Omit<YearItem, "id">,
  file: File | null,
  editingId: number | null
): Promise<void> {
  let thumbnailUrl = payload.imageUrl;

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const uploadRes = await axios.post(
      `${API_BASE_URL}/year/yearImage`,
      formData
    );
    thumbnailUrl = uploadRes.data.url;
  }

  const finalPayload = { ...payload, imageUrl: thumbnailUrl };

  if (editingId !== null) {
    await axios.put(`${API_BASE_URL}/year/${editingId}`, finalPayload);
  } else {
    await axios.post(`${API_BASE_URL}/year`, finalPayload);
  }
}

export async function deleteYear(id: number, imageUrl?: string): Promise<void> {
  if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/year/${id}`);
    if (!imageUrl) return;

    if (imageUrl) {
      try {
        await axios.delete(`${API_BASE_URL}/year/delete-image`, {
          data: { thumbnailUrl: imageUrl },
        });
        console.log("Phản hồi xóa hình ảnh: Đã xóa thành công");
      } catch (imageDeleteError: any) {
        console.error("Lỗi khi xóa ảnh trên server: ", imageDeleteError);
        if (imageDeleteError.response?.status === 404) {
          console.warn(
            "Hình ảnh không được tìm thấy trên server, nhưng tin tức đã xóa thành công."
          );
        } else if (imageDeleteError.response?.status === 403) {
          throw new Error("Không có quyền xóa ảnh, nhưng tin tức đã bị xóa");
        } else {
          throw new Error("Xóa ảnh không thành công, nhưng tin tức đã bị xóa!");
        }
      }
    }
    alert("Tin tức đã được xóa thành công!");
  } catch (error: any) {
    console.error("Lỗi khi xóa tin tức:", error);
    throw new Error(
      ` Xóa tin tức thất bại. Vui lòng thử lại! ${error.message || ""}`
    );
  }
}

export async function deleteCurrentImage(imageUrl: string): Promise<void> {
  if (!window.confirm("Bạn có chắc chắn muốn xóa hình ảnh hiện tại không?"))
    return;

  try {
    const deleteImageRes = await axios.delete(
      `${API_BASE_URL}/year/delete-image`,
      {
        data: { thumbnailUrl: imageUrl },
      }
    );
    console.log("Hình ảnh hiện tại đã được xóa:", deleteImageRes.data.message);
    alert("Ảnh hiện tại đã được xóa khỏi Database");
  } catch (err: any) {
    console.error("Lỗi khi xóa ảnh hiện tại:", err);
    throw new Error(
      ` Lỗi khi xóa ảnh hiện tại: ${err.response?.data?.error || err.message}`
    );
  }
}
